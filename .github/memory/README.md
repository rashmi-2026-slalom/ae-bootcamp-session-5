# Development Memory System

## Purpose
This memory system tracks patterns, decisions, and lessons learned during development to create context-aware AI assistance. It helps maintain continuity across development sessions and enables the AI to learn from project-specific discoveries.

## Two Types of Memory

### Persistent Memory
Located in `.github/copilot-instructions.md`, this contains:
- Foundational project principles
- Core workflow patterns
- Universal testing guidelines
- Agent usage rules

**When to update:** When you establish new project-wide standards or change fundamental workflows.

### Working Memory
Located in `.github/memory/`, this contains:
- Session-specific discoveries and learnings
- Accumulated code patterns
- Active development notes

**When to update:** During and after each development session to capture context and decisions.

## Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the system
├── session-notes.md             # Historical summaries of completed sessions (COMMITTED)
├── patterns-discovered.md       # Accumulated code patterns over time (COMMITTED)
└── scratch/                     # Active session workspace (NOT COMMITTED)
    ├── .gitignore               # Ignores all files in scratch/
    └── working-notes.md         # Current session notes and scratchpad
```

## File Usage Guide

### session-notes.md (Committed Historical Record)
**Purpose:** Document completed development sessions for future reference.

**When to use:**
- At the END of a development session
- After completing a feature, fix, or refactor
- When wrapping up a TDD cycle with lessons learned

**What to capture:**
- Session name and date
- What was accomplished (features, fixes, refactors)
- Key findings and decisions made
- Test results and coverage changes
- Outcomes and next steps

**Workflow:**
1. Work in `scratch/working-notes.md` during active development
2. At session end, review your scratch notes
3. Summarize key findings into a new entry in `session-notes.md`
4. Commit `session-notes.md` to preserve the historical record
5. Clear or archive `scratch/working-notes.md` for the next session

### patterns-discovered.md (Committed Pattern Library)
**Purpose:** Document recurring code patterns, architectural decisions, and solutions.

**When to use:**
- During TDD when you discover a consistent testing pattern
- During debugging when you find a recurring issue and solution
- During code review when you establish a convention
- When linting reveals a pattern that should be standardized

**What to capture:**
- Pattern name and context
- Problem it solves
- Solution with code examples
- Related files where pattern is used
- When to apply vs avoid the pattern

**Workflow:**
1. Notice a pattern emerging during development (e.g., "always initialize arrays, not null")
2. Document it in `patterns-discovered.md` using the template
3. Reference the pattern in future code reviews
4. AI will learn and suggest this pattern in similar contexts

### scratch/working-notes.md (Active Session - Not Committed)
**Purpose:** Real-time notes, scratchpad, and working memory during active development.

**When to use:**
- Throughout your ENTIRE development session
- During TDD cycles to track test failures and fixes
- During debugging to document hypotheses and results
- During integration work to track dependencies
- When context-switching to capture your current state

**What to capture:**
- Current task and approach
- Test failures and debugging steps
- Key findings as you discover them
- Decisions made with rationale
- Blockers and questions
- Next steps and todos

**Workflow:**
1. Start each session by opening `scratch/working-notes.md`
2. Update it continuously as you work (AI can help with this)
3. Use it as a scratchpad for ideas, hypotheses, and temporary notes
4. At session end, extract key findings into `session-notes.md`
5. Working notes are NOT committed (ephemeral workspace)

## How AI Uses This Memory

### During TDD Workflow
1. **Red Phase:** AI checks `patterns-discovered.md` for relevant test patterns
2. **Green Phase:** AI references past solutions in `session-notes.md` for similar features
3. **Refactor Phase:** AI suggests patterns from `patterns-discovered.md` to improve code
4. **Throughout:** AI updates `scratch/working-notes.md` with findings and decisions

### During Linting Workflow
1. AI checks `patterns-discovered.md` for established code style patterns
2. AI documents new patterns discovered during systematic lint fixes
3. AI references similar lint issues resolved in `session-notes.md`

### During Debugging Workflow
1. AI checks `session-notes.md` for similar issues encountered before
2. AI documents debugging steps in `scratch/working-notes.md`
3. If a recurring pattern emerges, AI suggests adding to `patterns-discovered.md`

### During Integration Workflow
1. AI reviews recent `session-notes.md` entries for context on what changed
2. AI documents integration findings in `scratch/working-notes.md`
3. AI suggests related patterns from `patterns-discovered.md`

## Best Practices

### For Developers
- **Be consistent:** Update memory files as you work, not just at session end
- **Be specific:** Include file paths, line numbers, and concrete examples
- **Be concise:** Bullet points and structured formats over long prose
- **Review regularly:** Start each session by reviewing recent session notes
- **Commit strategically:** Commit historical records (session-notes.md, patterns-discovered.md), not scratch notes

### For AI Assistants
- **Reference memory proactively:** Check memory files when providing suggestions
- **Suggest updates:** Remind developers to document discoveries in memory
- **Apply patterns:** Use `patterns-discovered.md` to ensure consistency
- **Learn from history:** Reference `session-notes.md` to avoid repeating past mistakes
- **Keep scratch current:** Update `scratch/working-notes.md` during active work

## Example Workflow

### Starting a Session
1. Review recent entries in `session-notes.md` for context
2. Open `scratch/working-notes.md` to capture active work
3. Reference `patterns-discovered.md` for relevant patterns

### During Development (TDD Cycle)
1. Write failing test (Red)
2. Document test failure in `scratch/working-notes.md`
3. Implement feature (Green)
4. Document key decisions in `scratch/working-notes.md`
5. Refactor using patterns from `patterns-discovered.md`
6. Update scratch notes with final approach

### Ending a Session
1. Review `scratch/working-notes.md` for key findings
2. Create a new entry in `session-notes.md` with summary
3. If a pattern emerged, add to `patterns-discovered.md`
4. Commit `session-notes.md` and `patterns-discovered.md`
5. Clear or archive `scratch/working-notes.md` for next session

## Key Difference: Committed vs Ephemeral

**session-notes.md and patterns-discovered.md** are COMMITTED to git:
- They are historical records
- They persist across sessions and team members
- They are the source of truth for what was learned

**scratch/working-notes.md** is NOT COMMITTED (ignored by git):
- It's your active workspace
- It's ephemeral and personal
- It's a scratchpad for thinking, not a record
- At session end, you extract the valuable parts into committed files

This separation keeps your working space clean while preserving learnings for the future.
