# WorkMesh
### Map the work. Design the workforce.

**WorkMesh is a task-level workforce decision intelligence application that helps organizations analyze business processes and determine how work should be distributed across humans, AI, and automation.**

[**Live Demo**](https://workmesh-five.vercel.app/) · [**GitHub Repository**](https://github.com/lakshmikarimireddy-sudo/workmesh)

## The Problem

Organizations are rapidly adopting AI and automation, but workforce transformation decisions are often made at the job-title level. This can obscure the fact that different tasks within the same role require very different approaches.

Some tasks demand human judgment and accountability. Others benefit from AI assistance. Routine, rule-based tasks may be suitable for automation.

The challenge is to determine **what should happen to each task—and why.**

## The Solution

WorkMesh provides a structured workflow for analyzing business processes at the task level and translating that analysis into an explainable workforce allocation blueprint.

Rather than treating an entire job as one unit, WorkMesh evaluates individual tasks and recommends an appropriate workforce model based on the application's decision rules.

## How It Works

1. **Process Map** — Explore the tasks that make up a business process.
2. **Task Intelligence** — Review task-level analysis and recommendations.
3. **Workforce Allocation** — Examine how tasks are distributed across workforce modes.
4. **Workforce Blueprint** — View the resulting workforce distribution.
5. **What-If Simulation** — Explore alternative allocation scenarios by adjusting the simulation slider.

The application currently demonstrates this workflow using a customer support process containing eight tasks.

## Workforce Models

WorkMesh uses four internal allocation modes:

- **Human** — Work remains with a person.
- **Human + AI** — A person performs the work with AI assistance.
- **AI** — Work is assigned to an AI-based capability.
- **Automation** — Rule-based work is handled through automation.

The executive blueprint consolidates these into three broader categories: human-led, AI-enabled, and automation.

## Explainable Decision Logic

WorkMesh uses a deterministic, rule-based decision engine to analyze tasks and produce recommendations. Its objective is to make the allocation logic understandable rather than present recommendations as unexplained predictions.

The What-If Simulation lets users explore how changing an allocation scenario affects the workforce distribution. It is a scenario-modeling capability, not a validated forecast of actual workforce outcomes.

## Technology Stack

- React
- TypeScript
- Vite
- CSS
- Vercel for deployment
- GitHub for source control

## Try WorkMesh

**Live application:** https://workmesh-five.vercel.app/

Open the application, select **Analyze Process**, and follow the workflow from process mapping through workforce analysis and simulation.

## Project Status

WorkMesh is a working demonstration of task-level workforce decision intelligence. The current implementation focuses on explainable recommendations, workforce allocation, blueprint visualization, and deterministic scenario simulation.

## Vision

**Move workforce transformation from job-level assumptions to task-level decisions.**

WorkMesh aims to help decision-makers reason more clearly about which work should remain human-led, where AI can augment people, and where automation may be appropriate.
