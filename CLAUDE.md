# 🚗 OOPMentor

> **Learn C# Object-Oriented Programming by watching your code move.**
> An interactive full-stack learning platform that compiles and executes real C# in a secure sandbox, then renders the *live object state* as an animated 2D visual (starting with a drivable car), auto-generates UML class diagrams from your code, and pairs you with an AI Socratic tutor that guides — never spoils — the answer.

[![.NET](https://img.shields.io/badge/.NET-8%2F9-512BD4)](#)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB)](#)
[![SignalR](https://img.shields.io/badge/RealTime-SignalR-0078D4)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#)

---

## 📑 Table of Contents


1. [Problem & Core Value Proposition](#-problem--core-value-proposition)
2. [Architecture & Visual Layout](#-architecture--visual-layout)
3. [Tech Stack](#-tech-stack)
4. [Database Schema](#-database-schema)
5. [API Endpoint Specifications](#-api-endpoint-specifications)
6. [API Response Contract (Result Pattern)](#-api-response-contract-result-pattern)
7. [Project Roadmap](#-project-roadmap)
8. [Getting Started](#-getting-started)

---

## 🎯 Problem & Core Value Proposition

### The Problem

Object-Oriented Programming is traditionally taught through **static text**: a slide defines "encapsulation," a textbook shows a `class` keyword, and a student is expected to build a mental model of objects, state, and message-passing entirely in their imagination. This abstraction gap is the single largest reason beginners plateau when moving from procedural scripts to OOP-based systems (C#, Java, C++). Students can *recite* the four pillars of OOP (Encapsulation, Inheritance, Polymorphism, Abstraction) without being able to *predict* what a program will do when it runs.

Existing tools solve pieces of this but not the whole:
- **LeetCode / HackerRank** — validate output, but give zero insight into *why* the object state changed.
- **Visual Studio / Rider** — powerful debuggers, but the "watch window" is a wall of text, not built for pedagogy.
- **Scratch / Blockly** — visual and intuitive, but abandon real syntax entirely, creating a second gap when students transition to real code.

### The Core Value Proposition

OOPMentor closes the abstraction gap by giving every C# object a **visual, physical representation**. When a student writes:

```csharp
public class Car
{
    public int Speed { get; private set; }
    public void Accelerate(int amount) => Speed += amount;
}

var myCar = new Car();
myCar.Accelerate(20);
```

...the platform doesn't just print `Speed: 20` to a console. It **animates a 2D car sprite accelerating on screen**, in real time, while simultaneously:
- Highlighting the exact line of code currently executing (via SignalR-streamed execution events).
- Rendering a live UML class diagram showing `Car`'s fields, properties, and methods, updating as new members are added.
- Logging each state mutation to a structured console panel (`Speed changed 0 → 20`).

This turns an abstract mutation (`Speed += amount`) into an observable, causal event (the car visibly speeds up), which is how humans build intuition fastest.

### Target Audience

| Segment | Use Case |
|---|---|
| **CS1/CS2 university students** | Learning OOP fundamentals (classes, inheritance, polymorphism) in a first C#/Java-adjacent course. |
| **Bootcamp students** | Fast-tracking into C#/.NET careers, needing visceral understanding, not just syntax memorization. |
| **Self-taught / career-switcher developers** | Filling OOP gaps left by tutorial-hopping or purely web-framework-first learning paths. |
| **Instructors** | Assigning auto-graded exercises with a visual "proof of understanding" component instead of purely text-diffed unit tests. |

### Learning Progression Model

The curriculum is organized into sequential **Modules**, each unlocking the next only after a mastery threshold (submission accuracy + hint-usage ratio) is met. This is a **scaffolded, spiral curriculum**: the same `Car` domain object is reused and extended across modules so that new OOP concepts are layered onto a familiar mental model rather than resetting context every lesson.

```
Module 1: Classes & Objects        → Define Car, instantiate it, call methods.
Module 2: Encapsulation            → Convert public fields to private + properties, add validation.
Module 3: Inheritance               → Create SportsCar : Car, override Accelerate().
Module 4: Polymorphism              → List<Car> containing mixed subtypes, virtual/override dispatch.
Module 5: Abstraction & Interfaces  → IDrivable, ICollidable, abstract base Vehicle.
Module 6: Composition               → Car has-a Engine, has-a FuelTank (favor composition over inheritance).
Module 7: Capstone Project          → Multi-class traffic simulation combining all pillars.
```

Each exercise tracks **mastery signals** (attempts, time-on-task, hints requested, final correctness) which feed the `UserProgress` table and drive an adaptive "you might want to revisit Module 2" recommendation shown on the dashboard.

---

## 🏗️ Architecture & Visual Layout

### High-Level System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (React SPA)                              │
│  ┌────────────────┐   ┌───────────────────┐   ┌──────────────────────────┐   │
│  │  Monaco Editor  │   │   Visual Canvas    │   │      AI Tutor Panel      │   │
│  │  (C# syntax)    │   │  (SVG car / state) │   │  (Socratic chat + hints) │   │
│  └────────┬────────┘   └─────────┬──────────┘   └────────────┬─────────────┘   │
│           │  REST (run code)     │  SignalR (execution events) │              │
└───────────┼──────────────────────┼───────────────────────────┼────────────────┘
            │                      │                             │
            ▼                      ▼                             ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     ASP.NET CORE WEB API (.NET 8/9)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │  Presentation │→ │ Application  │→ │    Domain     │  │  Infrastructure │  │
│  │ (Controllers, │  │ (Use Cases,  │  │  (Entities,   │  │  (EF Core, AI   │  │
│  │  SignalR Hubs)│  │  DTOs, Result│  │   Interfaces) │  │  client, Roslyn │  │
│  │               │  │  <T> wrapper)│  │               │  │  Sandbox Runner)│  │
│  └──────────────┘  └──────────────┘  └───────────────┘  └─────────┬───────┘  │
└─────────────────────────────────────────────────────────────────────┼─────────┘
                                                                        │
                        ┌───────────────────────────┬───────────────────┴───────────┐
                        ▼                           ▼                                ▼
              ┌───────────────────┐      ┌────────────────────┐         ┌──────────────────────┐
              │   SQL Server       │      │  Roslyn Scripting  │         │  OpenAI / Claude API  │
              │  (EF Core, users,  │      │  Sandbox (isolated │         │  (Socratic hint       │
              │  progress, chat)   │      │  AppDomain/Process)│         │  generation)          │
              └───────────────────┘      └────────────────────┘         └──────────────────────┘
```

This follows **Clean Architecture** (Domain → Application → Infrastructure → Presentation), so the Domain layer has zero dependency on EF Core, Roslyn, or any external SDK — those are injected via interfaces (`ICodeSandbox`, `IAiTutorClient`, `IUserProgressRepository`) implemented in Infrastructure.

### 3-Panel Studio Layout (Client UI)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  OOPMentor               Module 3: Inheritance — Exercise 4/6           [👤 Ahmad]   │
├───────────────────────────┬──────────────────────────────┬─────────────────────────┤
│ 1  public class SportsCar │        VISUAL CANVAS          │      🤖 AI TUTOR         │
│ 2  : Car                  │                                │                          │
│ 3  {                      │      🏎️  ← animates live       │  You: My override isn't │
│ 4►   public override      │        Speed: 45 km/h          │  firing, why?            │
│ 5    void Accelerate      │        ▓▓▓▓▓▓▓░░░ 45%          │                          │
│ 6    (int amount)         │                                │  Tutor: Good question -  │
│ 7    {                    │  ┌──────────────────────────┐  │  what keyword does the   │
│ 8      base.Accelerate    │  │      UML (live)            │ │  base class method need  │
│ 9      (amount * 2);      │  │  ┌────────────┐            │ │  for it to be            │
│10    }                    │  │  │    Car     │            │ │  overridable at all? 🤔  │
│11  }                      │  │  ├────────────┤            │ │                          │
│                            │  │  │ -Speed:int │            │ │  [Type your answer...]  │
│  ▶ Run   ⏸ Step  🔁 Reset  │  │  ├────────────┤            │ │                          │
│──────────────────────────  │  │  │+Accelerate()│           │ ├─────────────────────────┤
│ CONSOLE OUTPUT             │  │  └─────┬──────┘            │ │ 💡 Hint (1/3 used)      │
│ > Speed changed 0 → 45     │  │        △ inherits           │ │ 🎯 3/6 tests passing    │
│ > SportsCar.Accelerate hit │  │  ┌─────┴──────┐            │ │                          │
│ > base.Accelerate(90)      │  │  │ SportsCar  │            │ │                          │
└───────────────────────────┴──└────────────┘──────────────┴─────────────────────────┘
       LEFT: Monaco Editor            CENTER: Visual Canvas          RIGHT: AI Tutor
```

- **Left Panel — Monaco Editor:** Full C# IntelliSense-style editing, current-execution-line highlighting driven by SignalR events streamed from the Roslyn sandbox, inline diagnostics from Roslyn's diagnostic bag.
- **Center Panel — Visual Canvas:** Split into the animated SVG state visualizer (top) and a live-generated UML class diagram (bottom), built with React Flow (`@xyflow/react`) nodes/edges derived from Roslyn `SyntaxTree` reflection.
- **Right Panel — AI Tutor:** A chat interface constrained to the **Socratic method** — the system prompt forbids directly revealing the fix, instead asking a guiding question back, plus a hint-budget meter and live test-pass counter.

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend Framework | React 18+ (TypeScript) | SPA shell, component composition |
| Styling | Tailwind CSS | Utility-first styling, dark-mode-first design system |
| Code Editor | `@monaco-editor/react` | In-browser C# editing with syntax highlighting & diagnostics |
| Diagramming | `@xyflow/react` (React Flow) | Interactive, auto-layouted UML class diagrams |
| Real-Time Client | `@microsoft/signalr` | Streaming execution/state events from the sandbox to the UI |
| Backend Framework | ASP.NET Core Web API (.NET 8/9) | REST + SignalR hub host, Clean Architecture |
| Code Execution | `Microsoft.CodeAnalysis.CSharp.Scripting` (Roslyn) | Dynamic, sandboxed compilation & execution of submitted C# |
| Real-Time Server | ASP.NET Core SignalR | Pushes execution step, state-change, and console events |
| Database | SQL Server | Relational storage for users, curriculum, progress, chat history |
| ORM | Entity Framework Core | Code-first migrations, LINQ querying, change tracking |
| AI Integration | OpenAI API / Anthropic Claude API | Socratic hint generation, constrained via system prompts |
| Auth | ASP.NET Core Identity + JWT | Stateless bearer-token auth across REST and SignalR |

---

## 🗄️ Database Schema

### Entity-Relationship Diagram (ASCII)

```
┌────────────────────┐        ┌─────────────────────────┐
│       Users         │        │        Exercises          │
├────────────────────┤        ├─────────────────────────┤
│ PK Id (uniqueid.)   │        │ PK Id (uniqueidentifier) │
│    Email            │        │    ModuleNumber (int)     │
│    DisplayName       │        │    Title                  │
│    PasswordHash       │        │    Description             │
│    Role                │        │    StarterCode              │
│    CreatedAtUtc         │        │    SolutionCode              │
│    LastLoginAtUtc        │        │    DifficultyLevel            │
└──────────┬──────────┘        │    OrderIndex                   │
           │ 1                  │    CreatedAtUtc                    │
           │                    └───────────┬─────────────────────┘
           │                                 │ 1
           │  1                              │
           ▼                                 ▼  N
┌────────────────────┐        ┌─────────────────────────┐
│    UserProgress     │  N───1 │                          │
├────────────────────┤◄───────┤   (FK ExerciseId)         │
│ PK Id (uniqueid.)   │        └─────────────────────────┘
│ FK UserId ──────────┼──► Users.Id
│ FK ExerciseId ──────┼──► Exercises.Id
│    Status (enum)     │
│    AttemptsCount       │
│    HintsUsedCount        │
│    IsCompleted             │
│    Score (decimal?)          │
│    LastSubmittedCode          │
│    StartedAtUtc                 │
│    CompletedAtUtc (nullable)      │
└────────────────────┘

┌────────────────────┐        ┌─────────────────────────┐
│   AIChatSessions     │  1   N │      AIChatMessages       │
├────────────────────┤◄───────┤─────────────────────────┤
│ PK Id (uniqueid.)   │        │ PK Id (uniqueidentifier)  │
│ FK UserId ──────────┼──► Users.Id
│ FK ExerciseId ──────┼──► Exercises.Id (nullable)
│    Title              │        │ FK SessionId ──► AIChatSessions.Id
│    CreatedAtUtc         │        │    Role (enum: user/assistant/system)
│    UpdatedAtUtc           │        │    Content (nvarchar(max))
└────────────────────┘        │    HintLevel (int, nullable)
                                │    TokensUsed (int, nullable)
                                │    CreatedAtUtc
                                └─────────────────────────┘
```

### Table: `Users`

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `Id` | `uniqueidentifier` | No | `NEWID()` | **PK** |
| `Email` | `nvarchar(256)` | No | — | **Unique index** |
| `DisplayName` | `nvarchar(100)` | No | — | |
| `PasswordHash` | `nvarchar(500)` | No | — | ASP.NET Core Identity hash |
| `Role` | `nvarchar(20)` | No | `'Student'` | Check: `Student`, `Instructor`, `Admin` |
| `CreatedAtUtc` | `datetime2` | No | `SYSUTCDATETIME()` | |
| `LastLoginAtUtc` | `datetime2` | Yes | `NULL` | |

```sql
CREATE TABLE Users (
    Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    Email           NVARCHAR(256)    NOT NULL,
    DisplayName     NVARCHAR(100)    NOT NULL,
    PasswordHash    NVARCHAR(500)    NOT NULL,
    Role            NVARCHAR(20)     NOT NULL DEFAULT 'Student',
    CreatedAtUtc    DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    LastLoginAtUtc  DATETIME2        NULL,
    CONSTRAINT PK_Users PRIMARY KEY (Id),
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT CK_Users_Role CHECK (Role IN ('Student', 'Instructor', 'Admin'))
);
```

### Table: `Exercises`

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `Id` | `uniqueidentifier` | No | `NEWID()` | **PK** |
| `ModuleNumber` | `int` | No | — | 1–7, curriculum module |
| `Title` | `nvarchar(200)` | No | — | |
| `Description` | `nvarchar(max)` | No | — | Markdown-formatted prompt |
| `StarterCode` | `nvarchar(max)` | No | — | Pre-loaded into Monaco Editor |
| `SolutionCode` | `nvarchar(max)` | No | — | Used for automated diffing/grading |
| `DifficultyLevel` | `tinyint` | No | `1` | 1 = Beginner, 2 = Intermediate, 3 = Advanced |
| `OrderIndex` | `int` | No | `0` | Sequencing within a module |
| `CreatedAtUtc` | `datetime2` | No | `SYSUTCDATETIME()` | |

```sql
CREATE TABLE Exercises (
    Id               UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    ModuleNumber     INT              NOT NULL,
    Title            NVARCHAR(200)    NOT NULL,
    Description      NVARCHAR(MAX)    NOT NULL,
    StarterCode      NVARCHAR(MAX)    NOT NULL,
    SolutionCode     NVARCHAR(MAX)    NOT NULL,
    DifficultyLevel  TINYINT          NOT NULL DEFAULT 1,
    OrderIndex       INT              NOT NULL DEFAULT 0,
    CreatedAtUtc     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Exercises PRIMARY KEY (Id),
    CONSTRAINT CK_Exercises_Difficulty CHECK (DifficultyLevel BETWEEN 1 AND 3)
);
```

### Table: `UserProgress`

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `Id` | `uniqueidentifier` | No | `NEWID()` | **PK** |
| `UserId` | `uniqueidentifier` | No | — | **FK → Users.Id** |
| `ExerciseId` | `uniqueidentifier` | No | — | **FK → Exercises.Id** |
| `Status` | `nvarchar(20)` | No | `'NotStarted'` | `NotStarted`, `InProgress`, `Completed` |
| `AttemptsCount` | `int` | No | `0` | |
| `HintsUsedCount` | `int` | No | `0` | |
| `IsCompleted` | `bit` | No | `0` | |
| `Score` | `decimal(5,2)` | Yes | `NULL` | 0.00–100.00 |
| `LastSubmittedCode` | `nvarchar(max)` | Yes | `NULL` | |
| `StartedAtUtc` | `datetime2` | No | `SYSUTCDATETIME()` | |
| `CompletedAtUtc` | `datetime2` | Yes | `NULL` | |

```sql
CREATE TABLE UserProgress (
    Id                 UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    UserId             UNIQUEIDENTIFIER NOT NULL,
    ExerciseId         UNIQUEIDENTIFIER NOT NULL,
    Status             NVARCHAR(20)     NOT NULL DEFAULT 'NotStarted',
    AttemptsCount      INT              NOT NULL DEFAULT 0,
    HintsUsedCount     INT              NOT NULL DEFAULT 0,
    IsCompleted        BIT              NOT NULL DEFAULT 0,
    Score              DECIMAL(5,2)     NULL,
    LastSubmittedCode  NVARCHAR(MAX)    NULL,
    StartedAtUtc       DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CompletedAtUtc     DATETIME2        NULL,
    CONSTRAINT PK_UserProgress PRIMARY KEY (Id),
    CONSTRAINT FK_UserProgress_Users FOREIGN KEY (UserId)
        REFERENCES Users (Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserProgress_Exercises FOREIGN KEY (ExerciseId)
        REFERENCES Exercises (Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserProgress_User_Exercise UNIQUE (UserId, ExerciseId),
    CONSTRAINT CK_UserProgress_Status CHECK (Status IN ('NotStarted', 'InProgress', 'Completed'))
);
```

### Table: `AIChatSessions`

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `Id` | `uniqueidentifier` | No | `NEWID()` | **PK** |
| `UserId` | `uniqueidentifier` | No | — | **FK → Users.Id** |
| `ExerciseId` | `uniqueidentifier` | Yes | `NULL` | **FK → Exercises.Id** (nullable — session may be general) |
| `Title` | `nvarchar(200)` | No | `'New Conversation'` | |
| `CreatedAtUtc` | `datetime2` | No | `SYSUTCDATETIME()` | |
| `UpdatedAtUtc` | `datetime2` | No | `SYSUTCDATETIME()` | |

```sql
CREATE TABLE AIChatSessions (
    Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    UserId        UNIQUEIDENTIFIER NOT NULL,
    ExerciseId    UNIQUEIDENTIFIER NULL,
    Title         NVARCHAR(200)    NOT NULL DEFAULT 'New Conversation',
    CreatedAtUtc  DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAtUtc  DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AIChatSessions PRIMARY KEY (Id),
    CONSTRAINT FK_AIChatSessions_Users FOREIGN KEY (UserId)
        REFERENCES Users (Id) ON DELETE CASCADE,
    CONSTRAINT FK_AIChatSessions_Exercises FOREIGN KEY (ExerciseId)
        REFERENCES Exercises (Id) ON DELETE SET NULL
);
```

### Table: `AIChatMessages`

| Column | Type | Nullable | Default | Constraints |
|---|---|---|---|---|
| `Id` | `uniqueidentifier` | No | `NEWID()` | **PK** |
| `SessionId` | `uniqueidentifier` | No | — | **FK → AIChatSessions.Id** |
| `Role` | `nvarchar(20)` | No | — | `user`, `assistant`, `system` |
| `Content` | `nvarchar(max)` | No | — | |
| `HintLevel` | `int` | Yes | `NULL` | 1 = nudge, 2 = guiding question, 3 = worked-example-adjacent |
| `TokensUsed` | `int` | Yes | `NULL` | For cost tracking / rate limiting |
| `CreatedAtUtc` | `datetime2` | No | `SYSUTCDATETIME()` | |

```sql
CREATE TABLE AIChatMessages (
    Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    SessionId     UNIQUEIDENTIFIER NOT NULL,
    Role          NVARCHAR(20)     NOT NULL,
    Content       NVARCHAR(MAX)    NOT NULL,
    HintLevel     INT              NULL,
    TokensUsed    INT              NULL,
    CreatedAtUtc  DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AIChatMessages PRIMARY KEY (Id),
    CONSTRAINT FK_AIChatMessages_Sessions FOREIGN KEY (SessionId)
        REFERENCES AIChatSessions (Id) ON DELETE CASCADE,
    CONSTRAINT CK_AIChatMessages_Role CHECK (Role IN ('user', 'assistant', 'system'))
);
```

---

## 🔌 API Endpoint Specifications

**Base URL:** `https://localhost:7001/api/v1`
**Auth:** All endpoints (except `/auth/*`) require `Authorization: Bearer <jwt>`.

### 1. Code Sandbox — `POST /api/v1/sandbox/run`

Compiles and executes submitted C# inside the Roslyn sandbox and streams execution events over SignalR (hub: `/hubs/execution`) while returning the final result synchronously.

**Request:**
```json
{
  "exerciseId": "b3a1e0b0-9d3d-4b4e-9a0c-2f8e3a1f2b10",
  "sourceCode": "public class Car\n{\n    public int Speed { get; private set; }\n    public void Accelerate(int amount) => Speed += amount;\n}\n\nvar myCar = new Car();\nmyCar.Accelerate(20);\nConsole.WriteLine(myCar.Speed);",
  "connectionId": "a1b2c3d4-signalr-connection-id"
}
```

**Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Execution completed successfully.",
  "data": {
    "executionId": "f4e2d1c0-1234-4a5b-8c9d-abcdef123456",
    "consoleOutput": [
      "Speed changed 0 -> 20",
      "20"
    ],
    "finalState": {
      "objects": [
        {
          "instanceName": "myCar",
          "typeName": "Car",
          "properties": { "Speed": 20 }
        }
      ]
    },
    "compilationDiagnostics": [],
    "executionTimeMs": 142,
    "testResults": [
      { "testName": "Speed_ShouldEqual20_AfterAccelerate", "passed": true }
    ]
  },
  "errors": null
}
```

**Response — `400 Bad Request` (compilation error):**
```json
{
  "success": false,
  "message": "Compilation failed.",
  "data": null,
  "errors": [
    "CS1002: ; expected (Line 4, Column 58)"
  ]
}
```

**Response — `408 Request Timeout` (infinite loop / exceeded execution budget):**
```json
{
  "success": false,
  "message": "Execution exceeded the maximum allowed time of 5000ms and was terminated.",
  "data": null,
  "errors": [ "ExecutionTimeoutException" ]
}
```

---

### 2. AI Socratic Hint — `POST /api/v1/ai/socratic-hint`

Requests a contextual hint for the student's current code state. The AI is constrained (via system prompt, see [Security & Sandbox Guardrails](#-security--sandbox-guardrails)) to respond with a guiding question rather than a direct answer, unless `hintLevel` reaches the maximum tier.

**Request:**
```json
{
  "sessionId": "c7d8e9f0-1111-2222-3333-444455556666",
  "exerciseId": "b3a1e0b0-9d3d-4b4e-9a0c-2f8e3a1f2b10",
  "currentCode": "public class SportsCar : Car\n{\n    public void Accelerate(int amount) => Speed += amount * 2;\n}",
  "studentQuestion": "My override isn't firing when I call it through a Car reference, why?",
  "requestedHintLevel": 1
}
```

**Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Hint generated.",
  "data": {
    "messageId": "9988a1b2-c3d4-e5f6-a7b8-c9d0e1f2a3b4",
    "hintLevel": 1,
    "response": "Good observation! Look closely at the Accelerate method in both Car and SportsCar - what keyword does a base class method need before it can be overridden at all?",
    "hintsRemainingForExercise": 2,
    "tokensUsed": 187
  },
  "errors": null
}
```

**Response — `429 Too Many Requests` (rate limit exceeded):**
```json
{
  "success": false,
  "message": "AI hint rate limit exceeded. You may request another hint in 34 seconds.",
  "data": null,
  "errors": [ "RateLimitExceeded" ]
}
```

---

### 3. Curriculum & Progress

#### `GET /api/v1/modules`

Returns the full curriculum tree with per-module aggregate progress for the authenticated user.

**Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Modules retrieved.",
  "data": {
    "modules": [
      {
        "moduleNumber": 1,
        "title": "Classes & Objects",
        "exerciseCount": 5,
        "completedCount": 5,
        "isUnlocked": true
      },
      {
        "moduleNumber": 3,
        "title": "Inheritance",
        "exerciseCount": 6,
        "completedCount": 3,
        "isUnlocked": true
      },
      {
        "moduleNumber": 4,
        "title": "Polymorphism",
        "exerciseCount": 4,
        "completedCount": 0,
        "isUnlocked": false
      }
    ]
  },
  "errors": null
}
```

#### `GET /api/v1/exercises/{id}`

Returns a single exercise's full detail, including starter code and the caller's existing progress record (if any).

**Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Exercise retrieved.",
  "data": {
    "id": "b3a1e0b0-9d3d-4b4e-9a0c-2f8e3a1f2b10",
    "moduleNumber": 3,
    "title": "Override Acceleration Behavior",
    "description": "Create a `SportsCar` class that inherits from `Car` and overrides `Accelerate` to apply a 2x multiplier...",
    "starterCode": "public class SportsCar : Car\n{\n    // TODO: override Accelerate\n}",
    "difficultyLevel": 2,
    "progress": {
      "status": "InProgress",
      "attemptsCount": 2,
      "hintsUsedCount": 1,
      "isCompleted": false,
      "lastSubmittedCode": "public class SportsCar : Car\n{\n    public void Accelerate(int amount) => Speed += amount * 2;\n}"
    }
  },
  "errors": null
}
```

**Response — `404 Not Found`:**
```json
{
  "success": false,
  "message": "Exercise not found.",
  "data": null,
  "errors": [ "ExerciseNotFound" ]
}
```

#### `POST /api/v1/exercises/{id}/submit`

Submits a final solution for grading. Runs the sandbox, diffs behavior against the exercise's automated test suite, and upserts the `UserProgress` row.
F/
**Request:**
```json
{
  "sourceCode": "public class SportsCar : Car\n{\n    public override void Accelerate(int amount) => base.Accelerate(amount * 2);\n}"
}
```

**Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Submission graded.",
  "data": {
    "isCorrect": true,
    "score": 100.00,
    "testResults": [
      { "testName": "Override_Should_Double_Acceleration", "passed": true },
      { "testName": "Base_Class_Speed_Should_Update", "passed": true }
    ],
    "consoleOutput": [ "Speed changed 0 -> 40" ],
    "progress": {
      "status": "Completed",
      "attemptsCount": 3,
      "isCompleted": true,
      "completedAtUtc": "2026-08-20T10:42:11Z"
    },
    "nextExerciseId": "d1e2f3a4-5555-6666-7777-888899990000"
  },
  "errors": null
}
```

---

## 📦 API Response Contract (Result Pattern)

Every endpoint returns a consistent `Result<T>` envelope so the frontend can handle success/failure uniformly without try/catch scattered across API calls.

```csharp
namespace OOPMentor.Application.Common;

/// <summary>
/// A generic, immutable result wrapper used as the standard return type
/// for all Application-layer use cases and API responses.
/// </summary>
/// <typeparam name="T">The type of the payload returned on success.</typeparam>
public sealed class Result<T>
{
    public bool Success { get; }
    public string Message { get; }
    public T? Data { get; }
    public IReadOnlyList<string>? Errors { get; }

    private Result(bool success, string message, T? data, IReadOnlyList<string>? errors)
    {
        Success = success;
        Message = message;
        Data = data;
        Errors = errors;
    }

    public static Result<T> Ok(T data, string message = "Operation completed successfully.") =>
        new(success: true, message: message, data: data, errors: null);

    public static Result<T> Fail(string message, IEnumerable<string>? errors = null) =>
        new(success: false, message: message, data: default, errors: errors?.ToList());

    public static Result<T> Fail(string message, string singleError) =>
        new(success: false, message: message, data: default, errors: new List<string> { singleError });
}
```

**Non-generic companion** for endpoints that return no payload (e.g., a `204`-style delete operation expressed as `200` with a message only):

```csharp
namespace OOPMentor.Application.Common;

public sealed class Result
{
    public bool Success { get; }
    public string Message { get; }
    public IReadOnlyList<string>? Errors { get; }

    private Result(bool success, string message, IReadOnlyList<string>? errors)
    {
        Success = success;
        Message = message;
        Errors = errors;
    }

    public static Result Ok(string message = "Operation completed successfully.") =>
        new(success: true, message: message, errors: null);

    public static Result Fail(string message, IEnumerable<string>? errors = null) =>
        new(success: false, message: message, errors: errors?.ToList());
}
```

**Controller usage example:**

```csharp
[HttpGet("{id:guid}")]
public async Task<IActionResult> GetExercise(Guid id)
{
    Result<ExerciseDetailDto> result = await _exerciseService.GetByIdAsync(id, User.GetUserId());
    return result.Success ? Ok(result) : NotFound(result);
}
```

---

## 🗺️ Project Roadmap

### Phase 0 — Foundation (Weeks 1–2)
- [ ] Scaffold Clean Architecture solution (`Domain`, `Application`, `Infrastructure`, `Api`, `Web`).
- [ ] Set up EF Core + SQL Server, write initial migration for all 5 core tables.
- [ ] Implement ASP.NET Core Identity + JWT auth (`/auth/register`, `/auth/login`, `/auth/refresh`).
- [ ] Stand up React + Vite + TypeScript + Tailwind shell with routing.

### Phase 1 — Core Sandbox Loop (Weeks 3–5)
- [ ] Implement `ICodeSandbox` + Roslyn-based `RoslynSandboxExecutor`.
- [ ] Apply static-analysis denylist walker for forbidden namespaces/APIs.
- [ ] Wire `POST /sandbox/run` end-to-end with Monaco Editor on the frontend.
- [ ] Implement SignalR `ExecutionHub` and stream console output live.
- [ ] Build the SVG car visualizer bound to `finalState.objects`.

### Phase 2 — Curriculum Engine (Weeks 6–8)
- [ ] Seed `Exercises` table for Modules 1–3 (Classes, Encapsulation, Inheritance).
- [ ] Implement `GET /modules`, `GET /exercises/{id}`, `POST /exercises/{id}/submit`.
- [ ] Build automated test-runner that diffs submitted output against exercise test cases.
- [ ] Implement `UserProgress` upsert logic + module unlock rules.
- [ ] Build curriculum sidebar UI with progress indicators.

### Phase 3 — Live UML Generation (Weeks 9–10)
- [ ] Build Roslyn `SyntaxTree` → class-member extractor service.
- [ ] Map extracted classes/relationships to React Flow nodes/edges.
- [ ] Render live-updating UML diagram in the Visual Canvas center panel.
- [ ] Support inheritance arrows, interface implementation (dashed), and composition edges.

### Phase 4 — AI Socratic Tutor (Weeks 11–13)
- [ ] Implement `IAiTutorClient` abstraction over OpenAI/Claude API.
- [ ] Author and test the Socratic system prompt + hint-level ladder.
- [ ] Implement `AIChatSessions` / `AIChatMessages` persistence.
- [ ] Wire `POST /ai/socratic-hint` with per-exercise hint-budget enforcement.
- [ ] Apply rate limiting, PII scrubbing, and prompt-injection safeguards.
- [ ] Build the chat panel UI with hint-level indicator.


### Phase 6 — Expansion (Post-Launch)
- [ ] Modules 4–7 content (Polymorphism, Abstraction, Composition, Capstone).
- [ ] Instructor dashboard: cohort analytics, per-student mastery heatmap.
- [ ] Additional visual domains beyond the car (e.g., a bank account simulator) reusing the same visualizer engine.
- [ ] Multiplayer "pair debugging" mode over a shared SignalR session.

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download) or later
- [Node.js 20+](https://nodejs.org/) and npm/pnpm
- SQL Server (LocalDB, or full instance)
- An OpenAI or Anthropic Claude API key

### Backend Setup

```bash
cd src/OOPMentor.Api
dotnet restore
dotnet ef database update --project ../OOPMentor.Infrastructure
dotnet run
```

The API will be available at `https://localhost:7001`, with Swagger UI at `https://localhost:7001/swagger`.

### Frontend Setup

```bash
cd src/oopmentor-web
npm install
npm run dev
```

The client will be available at `http://localhost:5173`.

### Environment Configuration

Create `src/OOPMentor.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=OOPMentorDb;Trusted_Connection=True;"
  },
  "Jwt": {
    "Issuer": "OOPMentor",
    "Audience": "OOPMentorClient",
    "SigningKey": "REPLACE_WITH_A_STRONG_SECRET_MINIMUM_32_CHARS"
  },
  "AiTutor": {
    "Provider": "OpenAI",
    "ApiKey": "REPLACE_WITH_YOUR_API_KEY",
    "Model": "gpt-4o-mini",
    "MaxTokensPerRequest": 300
  },
  "Sandbox": {
    "MaxExecutionMilliseconds": 5000,
    "MaxSourceCodeLength": 20000
  }
}
```

---

## 📄 License

MIT © OOPMentor Contributors
