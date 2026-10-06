"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { CalendarIcon } from "./CalendarIcon";
import {
  CLIENT_COOLDOWN_KEY, COOLDOWN_MS, budgets, errorsForStep, initialProjectRequest,
  projectTypes, type FieldKey, type ProjectRequestData, type ValidationErrors,
} from "@/lib/projectRequest";

const ids: Record<FieldKey, string> = {
  projectType: "form-project-type", name: "form-name", contact: "form-contact", email: "form-email",
  budget: "form-budget", reference: "form-reference", details: "form-details",
};
const firstInvalid: FieldKey[][] = [["projectType"], ["name"], ["contact", "email"], ["budget", "reference"], ["details"]];

export function ProjectRequestForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [data, setData] = useState<ProjectRequestData>(initialProjectRequest);
  const [honeypot, setHoneypot] = useState("");
  const inFlight = useRef(false);
  const pendingConfirmation = useRef<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const last = Number(window.localStorage.getItem(CLIENT_COOLDOWN_KEY) ?? 0);
      if (last && Date.now() - last < COOLDOWN_MS) setCooldown(true);
      else if (last) window.localStorage.removeItem(CLIENT_COOLDOWN_KEY);
    } catch { /* Private browsing may disable persistent storage. Server protection remains. */ }
  }, []);

  function set(key: FieldKey, value: string) {
    const next = { ...data, [key]: value };
    setData(next);
    if (errors[key] && !errorsForStep(next, step)[key]) setErrors((current) => {
      const copy = { ...current };
      delete copy[key];
      return copy;
    });
    if (submitError) setSubmitError("");
  }

  function focusError(issues: ValidationErrors, targetStep: number) {
    const key = firstInvalid[targetStep].find((field) => issues[field]);
    if (!key) return;
    window.requestAnimationFrame(() => {
      const node = document.getElementById(ids[key]);
      if (node instanceof HTMLElement) node.focus();
      else document.querySelector<HTMLElement>(`[data-invalid-choice="${key}"] button`)?.focus();
    });
  }

  function next() {
    const issues = errorsForStep(data, step);
    setErrors(issues);
    if (Object.keys(issues).length) { focusError(issues, step); return; }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
  }

  function back() {
    if (sending) return;
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function apiAction(payload: Record<string, unknown>) {
    const response = await fetch("/api/project-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    return { response, result };
  }

  async function finalizeSuccess(token: string) {
    const { response, result } = await apiAction({ action: "confirm", token });
    if (!response.ok || result.success !== true) {
      throw new Error(result.message || "Your request reached the email service, but confirmation could not be finalized. Please try again.");
    }
    pendingConfirmation.current = null;
    try { window.localStorage.setItem(CLIENT_COOLDOWN_KEY, String(Date.now())); } catch { /* nonfatal */ }
    setSent(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || sending) return;

    const entire = [0, 1, 2, 3, 4].map((index) => errorsForStep(data, index));
    const invalidStep = entire.findIndex((errorSet) => Object.keys(errorSet).length > 0);
    if (invalidStep >= 0) {
      setErrors(entire[invalidStep]);
      setSubmitError("");
      if (invalidStep !== step) { setDirection(-1); setStep(invalidStep); }
      window.setTimeout(() => focusError(entire[invalidStep], invalidStep), 30);
      return;
    }

    inFlight.current = true;
    setSending(true);
    setSubmitError("");

    try {
      // If Web3Forms already accepted the email but the cooldown confirmation failed,
      // retry only the confirmation so the visitor never sends a duplicate email.
      if (pendingConfirmation.current) {
        await finalizeSuccess(pendingConfirmation.current);
        return;
      }

      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
      if (!accessKey) {
        throw new Error("Project requests aren't configured yet. Please book a call or message me on WhatsApp.");
      }

      // 1) Server-side validation, rate limiting and 7-day duplicate check.
      const preflight = await apiAction({ action: "preflight", ...data, website: honeypot });
      if (!preflight.response.ok || preflight.result.success !== true) {
        if (preflight.response.status === 409 && preflight.result.alreadySubmitted) {
          setCooldown(true);
          return;
        }
        if (preflight.result.errors && typeof preflight.result.errors === "object") {
          const serverErrors = preflight.result.errors as ValidationErrors;
          const targetStep = [0, 1, 2, 3, 4].find((index) => Object.keys(errorsForStep(data, index)).some((key) => serverErrors[key as FieldKey]));
          if (typeof targetStep === "number") {
            setErrors(serverErrors);
            if (targetStep !== step) { setDirection(-1); setStep(targetStep); }
            window.setTimeout(() => focusError(serverErrors, targetStep), 30);
            return;
          }
        }
        throw new Error(preflight.result.message || "Your request couldn't be checked right now. Please try again.");
      }

      const token = String(preflight.result.token || "");
      if (!token) throw new Error("Your request couldn't be prepared. Please try again.");

      // 2) Free Web3Forms flow: submit directly from the browser with the public access key.
      const message = [
        `Project type: ${data.projectType}`,
        `Name: ${data.name.trim()}`,
        `Social / WhatsApp: ${data.contact.trim()}`,
        `Email: ${data.email.trim() || "Not provided"}`,
        `Budget: ${data.budget}`,
        `Reference / preferred style: ${data.reference.trim() || "Not provided"}`,
        `Project details: ${data.details.trim()}`,
      ].join("\n\n");

      let web3Response: Response;
      let web3Result: Record<string, unknown>;
      try {
        web3Response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: accessKey,
            from_name: "Raed Masri Portfolio",
            subject: `New project request — ${data.projectType}`,
            name: data.name.trim(),
            ...(data.email.trim() ? { email: data.email.trim() } : {}),
            message,
            project_type: data.projectType,
            contact: data.contact.trim(),
            budget: data.budget,
            reference: data.reference.trim() || "Not provided",
            project_details: data.details.trim(),
            botcheck: honeypot,
          }),
          signal: AbortSignal.timeout(15000),
        });
        web3Result = await web3Response.json().catch(() => ({})) as Record<string, unknown>;
      } catch (error) {
        await apiAction({ action: "cancel", token }).catch(() => undefined);
        throw error;
      }

      if (!web3Response.ok || web3Result.success !== true) {
        await apiAction({ action: "cancel", token }).catch(() => undefined);
        throw new Error(typeof web3Result.message === "string" ? web3Result.message : "Your request couldn't be sent right now. Please try again.");
      }

      // 3) Web3Forms has confirmed acceptance. Only now record the persistent cooldown.
      pendingConfirmation.current = token;
      await finalizeSuccess(token);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong sending your request. Please try again.");
    } finally {
      setSending(false);
      inFlight.current = false;
    }
  }

  if (cooldown) return (
    <div className="form-success" role="status">
      <span aria-hidden="true">✓</span>
      <h2>Request received.</h2>
      <p>Your project request has already been sent. I’ll get back to you soon.</p>
      <div className="form-success-actions"><a className="button form-primary-button" href={site.bookingUrl}>Book a call <span aria-hidden="true"><CalendarIcon /></span></a><a className="button form-secondary-button" href={site.whatsappUrl}>WhatsApp <span aria-hidden="true">↗</span></a></div>
    </div>
  );
  if (sent) return (
    <div className="form-success" role="status">
      <span aria-hidden="true">✓</span>
      <h2>That’s a wrap.</h2>
      <p>Your brief is in. I’ll review it and reply with the next step.</p>
      <div className="form-success-actions"><a className="button form-primary-button" href={site.bookingUrl}>Want to move faster? Book a call <span aria-hidden="true"><CalendarIcon /></span></a><a className="button form-secondary-button" href={site.whatsappUrl}>WhatsApp <span aria-hidden="true">↗</span></a></div>
    </div>
  );

  return (
    <form className="project-form" name="project-request" onSubmit={submit} noValidate aria-busy={sending}>
      <div className="form-progress"><span>Step {step + 1} of 5</span><div role="progressbar" aria-label="Project request progress" aria-valuemin={1} aria-valuemax={5} aria-valuenow={step + 1}><i style={{ width: `${((step + 1) / 5) * 100}%` }} /></div></div>
      <div className="form-honeypot" aria-hidden="true"><label htmlFor="form-company-website">Leave blank<input tabIndex={-1} autoComplete="off" id="form-company-website" name="website" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label></div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step}
          initial={reduceMotion ? false : { opacity: 0, x: direction > 0 ? 18 : -18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: direction > 0 ? -18 : 18 }}
          transition={{ duration: reduceMotion ? 0 : .2, ease: "easeOut" }}
          className="form-step">
          {step === 0 && <><p className="eyebrow">Your project</p><h2>What are we making?</h2><p>Pick the closest match. You can explain the details later.</p><div id={ids.projectType} className={`choice-grid ${errors.projectType ? "has-error" : ""}`} data-invalid-choice="projectType" role="group" aria-label="Project type" aria-invalid={Boolean(errors.projectType)}>{projectTypes.map((item) => <button type="button" key={item} aria-pressed={data.projectType === item} className={data.projectType === item ? "is-active" : ""} onClick={() => { set("projectType", item); setErrors({}); setDirection(1); setStep(1); }}>{item}<span>→</span></button>)}</div>{errors.projectType && <p className="form-error" role="alert">{errors.projectType}</p>}</>}
          {step === 1 && <><p className="eyebrow">You</p><h2>What should I call you?</h2><label className={`field ${errors.name ? "has-error" : ""}`} htmlFor={ids.name}>Your name<input autoFocus id={ids.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="First and last name" /></label>{errors.name && <p id="name-error" className="form-error" role="alert">{errors.name}</p>}{data.name.trim() && <p className="form-welcome">Nice to meet you, <em>{data.name.trim()}</em>.</p>}</>}
          {step === 2 && <><p className="eyebrow">Contact</p><h2>Where can I reach you?</h2><label className={`field ${errors.contact ? "has-error" : ""}`} htmlFor={ids.contact}>Social link or WhatsApp<input autoFocus id={ids.contact} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? "contact-error" : undefined} value={data.contact} onChange={(e) => set("contact", e.target.value)} placeholder="@handle, profile link or number" /></label>{errors.contact && <p id="contact-error" className="form-error" role="alert">{errors.contact}</p>}<label className={`field ${errors.email ? "has-error" : ""}`} htmlFor={ids.email}>Email (optional)<input id={ids.email} type="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" /></label>{errors.email && <p id="email-error" className="form-error" role="alert">{errors.email}</p>}</>}
          {step === 3 && <><p className="eyebrow">Scope</p><h2>What budget do you have in mind?</h2><div id={ids.budget} role="group" aria-label="Budget" data-invalid-choice="budget" aria-invalid={Boolean(errors.budget)} className={`choice-grid ${errors.budget ? "has-error" : ""}`}>{budgets.map((item) => <button type="button" key={item} aria-pressed={data.budget === item} className={data.budget === item ? "is-active" : ""} onClick={() => set("budget", item)}>{item}<span>✓</span></button>)}</div>{errors.budget && <p className="form-error" role="alert">{errors.budget}</p>}<label className={`field ${errors.reference ? "has-error" : ""}`} htmlFor={ids.reference}>A reference you like (optional)<input id={ids.reference} aria-invalid={Boolean(errors.reference)} value={data.reference} onChange={(e) => set("reference", e.target.value)} placeholder="Paste a link or describe the style" /></label>{errors.reference && <p className="form-error" role="alert">{errors.reference}</p>}</>}
          {step === 4 && <><p className="eyebrow">The brief</p><h2>Anything else I should know?</h2><label className={`field ${errors.details ? "has-error" : ""}`} htmlFor={ids.details}>Goals, channel, deadline and anything important<textarea autoFocus id={ids.details} maxLength={1200} aria-invalid={Boolean(errors.details)} value={data.details} onChange={(e) => set("details", e.target.value)} placeholder="Tell me what success looks like for this project…" /><small>{data.details.length} / 1200</small></label>{errors.details && <p className="form-error" role="alert">{errors.details}</p>}</>}
        </motion.div>
      </AnimatePresence>
      <div className="form-nav">
        {step > 0 && <button className="button form-secondary-button" type="button" onClick={back} disabled={sending}>Back</button>}
        {step < 4 ? <button className="button form-primary-button" type="button" onClick={next} disabled={sending}>Continue <span aria-hidden="true">↗</span></button> : <button className="button form-primary-button" type="submit" disabled={sending}>{sending ? "Sending…" : "Send request"}{!sending && <span aria-hidden="true">↗</span>}</button>}
      </div>
      {submitError && <p className="form-submit-error" role="alert">{submitError}</p>}
      <p className="form-privacy">No spam. Your details are only used to reply to your project request.</p>
    </form>
  );
}
