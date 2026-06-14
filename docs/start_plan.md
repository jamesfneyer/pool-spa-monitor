# Build a Next.js + AWS Amplify Gen 2 Pool & Spa Command Center

You are helping me build a production-quality web app called **Pool & Spa Command Center**.

## Goal

Build a modern Next.js app using **AWS Amplify Gen 2** that helps a homeowner track and manage a saltwater pool and hot tub.

The app should feel like a polished homeowner dashboard, not a toy demo.

## Tech Stack

Use:

* Next.js App Router
* TypeScript
* AWS Amplify Gen 2
* Amplify Auth
* Amplify Data
* DynamoDB/AppSync through Amplify
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* date-fns
* Recharts

## Core Product Concept

The user owns:

* A saltwater fiberglass pool
* Attached hot tub/spa
* Cartridge or DE-style pool filter
* Salt chlorine generator
* Pool pump and heater
* Pool robot

The app should let the user track water chemistry, maintenance, reminders, equipment, and notes.

## MVP Features

Build the MVP in phases.

### Phase 1: App Foundation

Create:

* Landing page
* Auth-protected dashboard
* Sign in/sign up flow
* Responsive layout
* Sidebar navigation
* Top header
* Light/dark mode support
* Basic empty states

Main sections:

* Dashboard
* Water Tests
* Chemical Dosing
* Equipment
* Maintenance
* Notes
* Settings

## Phase 2: Data Model

Create Amplify Gen 2 schema models for:

### PoolProfile

Fields:

* id
* name
* type: `pool | spa`
* gallons
* surfaceType
* sanitizerType
* targetFreeChlorineMin
* targetFreeChlorineMax
* targetPHMin
* targetPHMax
* targetAlkalinityMin
* targetAlkalinityMax
* targetCyaMin
* targetCyaMax
* targetSaltMin
* targetSaltMax
* createdAt
* updatedAt

### WaterTest

Fields:

* id
* poolProfileId
* testedAt
* freeChlorine
* totalChlorine
* pH
* alkalinity
* calciumHardness
* cya
* salt
* phosphates
* waterTemp
* notes
* createdAt
* updatedAt

### ChemicalDose

Fields:

* id
* poolProfileId
* waterTestId optional
* chemicalType
* amount
* unit
* reason
* addedAt
* notes
* createdAt
* updatedAt

### Equipment

Fields:

* id
* poolProfileId
* name
* category
* manufacturer
* model
* serialNumber
* installedAt
* warrantyExpiresAt
* notes
* createdAt
* updatedAt

### MaintenanceTask

Fields:

* id
* poolProfileId
* title
* category
* status: `pending | complete | skipped`
* dueDate
* completedAt
* recurrence
* notes
* createdAt
* updatedAt

### PoolNote

Fields:

* id
* poolProfileId
* title
* body
* category
* createdAt
* updatedAt

Set authorization so authenticated users can only access their own records.

## Phase 3: Dashboard

Create a dashboard showing:

* Current pool/spa profiles
* Latest water test summary
* Chemistry status badges
* Upcoming maintenance tasks
* Recent chemical additions
* Simple trend chart for pH and free chlorine
* Quick action buttons:

  * Add Water Test
  * Add Chemical Dose
  * Add Maintenance Task
  * Add Equipment

## Phase 4: Water Tests

Create:

* Water test list page
* Add water test form
* Edit water test form
* Detail view
* Basic validation with Zod
* Trend charts

Use practical pool chemistry ranges and show status badges:

* Low
* In range
* High
* Missing

## Phase 5: Chemical Dosing

Create:

* Chemical dose log
* Add chemical dose form
* Link optional dose to a water test
* Show total additions over time
* Include common chemical types:

  * Liquid chlorine
  * Muriatic acid
  * Baking soda
  * Calcium chloride
  * Cyanuric acid/stabilizer
  * Salt
  * Phosphate remover
  * Clarifier
  * Shock
  * Other

Do not implement exact chemical calculators yet. Add placeholders where calculators will go later.

## Phase 6: Equipment

Create equipment management:

* Equipment list
* Equipment detail page
* Add/edit equipment form
* Warranty expiration tracking
* Filter by category

Categories:

* Pump
* Filter
* Heater
* Salt cell
* Robot cleaner
* Automation
* Spa
* Other

## Phase 7: Maintenance

Create:

* Maintenance task list
* Calendar-style due date grouping
* Add/edit task form
* Mark complete
* Skip task
* Recurring task field placeholder

Suggested common tasks:

* Clean pump basket
* Clean skimmer baskets
* Clean filter cartridges
* Backwash filter
* Inspect salt cell
* Test water
* Brush pool
* Run robot
* Drain/refill spa
* Clean spa filters

## UI Direction

Use a clean luxury homeowner style:

* Calm pool-inspired design
* White cards
* Soft blue/teal accents
* Rounded corners
* Good spacing
* Mobile-friendly
* Dashboard should feel premium but simple

Use shadcn/ui components where possible:

* Card
* Button
* Input
* Select
* Dialog
* Sheet
* Badge
* Table
* Tabs
* DropdownMenu
* Calendar
* Form

## Implementation Requirements

* Keep code modular.
* Use server/client components appropriately.
* Create reusable components:

  * `StatusBadge`
  * `PageHeader`
  * `EmptyState`
  * `MetricCard`
  * `WaterChemistrySummary`
  * `MaintenanceTaskCard`
  * `EquipmentCard`
* Use TypeScript strictly.
* Use Zod schemas for forms.
* Use meaningful loading and error states.
* Avoid hardcoded fake data once Amplify Data is wired.
* Include seed/demo helper functions only if clearly separated.

## Initial Task

Start by scaffolding the app structure and building Phase 1 and Phase 2.

Please:

1. Inspect the current repo.
2. If needed, initialize a Next.js TypeScript app.
3. Install and configure Tailwind and shadcn/ui.
4. Install and configure AWS Amplify Gen 2.
5. Create the Amplify data schema.
6. Create the main app layout and navigation.
7. Create placeholder pages for all main sections.
8. Add a simple authenticated dashboard shell.
9. Make sure the app runs locally.
10. Explain what files were created or changed.

Do not skip setup details. Make this a real foundation that can be expanded into a production app.
