## Manual process implementation guide - Outline

### Main features

1. **Process structure adjustment** (5 steps):

- Step 1: Select template (similar to AI strategy selection page)
- Step 2: Fill in basic information (unique step)
- Step 3: Select target customers (consistent with AI process)
- Step 4: Generate content (consistent with AI process)
- Step 5: Preview and send (consistent with AI process)

2. **UI unified design**:

- **Template selection page**: Use the same design as AI strategy card (3-column grid, hover effect, indicator display)
- **Template details pop-up window**: Reuse the strategy details component of AI process (parameter adjustment: discount/urgency/tone)
- **Customer selection page**: Fully reuse the customer selection component of AI process
- **Content generation page**: Fully reuse the generate page of AI process (edit/preview switch, regenerate button)

3. **Key differences**:

- **Basic information step**: Campaign name, sending time, budget, etc. (with intelligent default values)
- **Template source**: Select from the template library, not AI recommendation
- **No AI tag**: The generated campaign does not have the `createdWithAI` logo
- **Template direct application**: After selecting the template, directly use its preset content structure

4. **Component reuse strategy**:

```
Shared components:
- StrategyCard → TemplateCard (same UI)
- StrategyDetailModal → TemplateDetailModal (same UI)
- CustomerSelectionPage (exactly the same)
- ContentGenerationPage (exactly the same)
- EmailEditor & EmailPreview (exactly the same)
```

5. **Data flow design**:

```
Template selection → sessionStorage: selected_template
↓
Basic information → sessionStorage: campaign_basics
↓
Customer selection → sessionStorage: selected_customers
↓
Content generation → Based on template + customer data
↓
Final sending → createdWithAI: false
```

6. **"I need to add a progress indicator component to the manual campaign creation process, with the following requirements:**

6.1. **Component location**: Display at the top of each step page

6.2. **Visual design**:

- 5 circular step icons arranged horizontally
- Steps are connected by lines
- Current step: purple background, white text, halo effect
- Completed steps: green background, check mark
- Uncompleted steps: gray background

6.3. **Step definition**:

- Step 1: Select Template (Template icon)
- Step 2: Campaign Details (Document icon)
- Step 3: Select Customers (User icon)
- Step 4: Generate Content (Magic Wand icon)
- Step 5: Preview & Send (Send icon)

6.4. **Interaction effect**:

- After completing a step, the step turns green with a check mark
- Click on the completed step to return to view
- There is a smooth transition animation

6.5. **Implementation method**:

- Create a shared ProgressIndicator component
- Import and pass the current step number on each step page
- Use sessionStorage to record completed steps"

7. **Unique Features**:

- **Smart Defaults**: Automatically fill in campaign name and time based on the selected template
- **Template Variable System**: Support {{firstName}}, {{lastVisit}}, {{discount}}, etc.
- **Batch Personalization**: Generate personalized versions for each customer
- **Draft Save**: Can save unfinished campaigns

8. **Routing Structure**:

```
/campaigns/create/
├── templates/ (template selection)
├── details/ (basic information)
├── customers/ (customer selection - reuse AI)
├── generate/ (content generation - reuse AI)
└── preview/ (final preview - reuse AI)
```

Such a design ensures a consistent experience for both processes while retaining the flexibility of the manual process.

## Other requirements

- Follow the principle of small steps and fast progress to split milestones and todolists;
- A summary needs to be generated and confirmed before each milestone is submitted
