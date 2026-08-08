# Security Policy

## Supported versions

`@ngneers/controls` is currently in **beta** and published under the `next`
dist-tag. Only the latest published version receives security fixes; there are
no backports to earlier pre-releases.

| Version        | Supported |
| -------------- | --------- |
| latest `next`  | ✅        |
| anything older | ❌        |

## Reporting a vulnerability

**Do not open a public issue.**

Report privately through
[GitHub Security Advisories](https://github.com/NGneers/controls/security/advisories/new),
which lets us discuss and fix the issue before it becomes public.

Please include:

- what the issue is and why it is exploitable;
- affected package and version;
- a minimal reproduction, if you have one;
- any suggested fix.

We aim to acknowledge a report within **5 working days** and to ship a fix, or
give you a timeline, within **30 days**. You will be credited in the advisory
unless you would rather not be.

## Scope

This is a client-side Angular component library. It renders in the user's
browser, has no server component, and makes no network requests of its own.

**In scope**

- XSS or HTML/attribute injection through a control's inputs — for example
  content that a control renders unescaped.
- Passthrough (`pt`) or template inputs allowing script injection where the
  documented contract says otherwise.
- A control leaking values it should not (e.g. a masked input exposing its raw
  value where it documents that it does not).
- A supply-chain issue in a published package: unexpected files, a dependency
  we ship that we should not.

**Out of scope**

- Vulnerabilities in Angular itself — report those to the
  [Angular team](https://github.com/angular/angular/security/policy).
- Issues that need the application to already be compromised, or that need
  attacker-controlled application source.
- Rendering untrusted HTML that your own application passes to a template input
  without sanitising. Sanitising application data is the application's job.
- Findings from automated scanners with no demonstrated impact.
- Denial of service by feeding a control a pathological data set (for example
  an unbounded item array). Bound your inputs.

## Handling untrusted content

Two notes for consumers, because they are the most common way to introduce a
problem while using the library correctly:

- **Template inputs and `TemplateRef`s** render your markup as-is. Do not build
  one from untrusted strings.
- **Passthrough `$attributes`** set attributes verbatim on internal elements.
  Do not derive them from user input.

Item labels, values and plain text inputs are rendered as text and are safe.
