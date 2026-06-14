import { Course } from '../types';

export type CourseAssignment = {
  title: string;
  brief: string;
  scenario: string;
  estimatedTime: string;
  difficulty: string;
  deliverables: string[];
  milestones: string[];
  rubric: string[];
  submissionFormat: string;
};

const categoryBlueprints = {
  content: {
    title: 'AI Content Campaign Build',
    scenario: 'You have been asked to launch a seven-day content campaign for a Nigerian business, creator, or community project.',
    deliverables: [
      'A one-page audience and content strategy',
      'Seven content ideas with hooks, captions, and calls to action',
      'Two polished scripts for short-form video',
      'A simple posting calendar with success metrics',
    ],
    milestones: [
      'Research the audience and define the main content goal',
      'Generate rough ideas, then select the strongest seven',
      'Rewrite two ideas into production-ready scripts',
      'Package the strategy, calendar, and metrics into one submission',
    ],
  },
  coding: {
    title: 'Practical AI Software Build',
    scenario: 'A small team needs a working tool that solves a real workflow problem using code and AI assistance.',
    deliverables: [
      'A short product brief explaining the user problem',
      'A working prototype, script, notebook, or web interface',
      'A README with setup steps and screenshots',
      'A reflection explaining what worked, what failed, and what you would improve',
    ],
    milestones: [
      'Define the user, input, output, and success criteria',
      'Build the smallest working version first',
      'Test it with at least three realistic examples',
      'Document the build and prepare a final demo',
    ],
  },
  data: {
    title: 'Insight Report and Decision Dashboard',
    scenario: 'A founder wants to understand a messy dataset and make one clear business decision from it.',
    deliverables: [
      'A cleaned dataset or documented cleaning steps',
      'Three charts or tables that explain the most useful patterns',
      'A one-page insight memo with recommendations',
      'A reproducible notebook, spreadsheet, or dashboard link',
    ],
    milestones: [
      'Define the business question',
      'Clean the data and document assumptions',
      'Create charts that directly answer the question',
      'Write recommendations with risks and next steps',
    ],
  },
  productivity: {
    title: 'AI Productivity System Design',
    scenario: 'You are designing a repeatable AI-assisted system for learning, work planning, research, or personal operations.',
    deliverables: [
      'A workflow map showing the before and after process',
      'A reusable prompt library with at least eight prompts',
      'A weekly operating template or checklist',
      'A short measurement plan for time saved or output quality',
    ],
    milestones: [
      'Choose one recurring workflow that wastes time',
      'Break it into steps and identify where AI should assist',
      'Create reusable prompts and templates',
      'Test the workflow for one realistic cycle and summarize results',
    ],
  },
  general: {
    title: 'Applied AI Capstone Project',
    scenario: 'You are solving a real problem for a learner, creator, small business, or team using the concepts from this course.',
    deliverables: [
      'A project brief with problem, audience, and expected outcome',
      'A working artifact such as a demo, document, workflow, or prototype',
      'Evidence of testing with realistic examples',
      'A final reflection with lessons learned and next steps',
    ],
    milestones: [
      'Select a focused problem',
      'Create a first version of the solution',
      'Test the solution and collect feedback',
      'Refine and submit the final project package',
    ],
  },
};

function getBlueprint(course: Course) {
  const text = `${course.category} ${course.title}`.toLowerCase();
  if (/content|creator|video|social|media|campaign|copy/.test(text)) return categoryBlueprints.content;
  if (/code|coding|software|web|python|developer|full-stack|app/.test(text)) return categoryBlueprints.coding;
  if (/data|analytics|science|dashboard|insight|pandas/.test(text)) return categoryBlueprints.data;
  if (/productivity|workflow|automation|systems|research/.test(text)) return categoryBlueprints.productivity;
  return categoryBlueprints.general;
}

export function generateCourseAssignment(course: Course): CourseAssignment {
  const blueprint = getBlueprint(course);
  return {
    title: `${blueprint.title}: ${course.title}`,
    brief: `Apply the lessons from ${course.title} by producing a practical project that can be reviewed, improved, and added to your portfolio.`,
    scenario: blueprint.scenario,
    estimatedTime: course.duration?.includes('45') ? '8-10 hours' : course.duration?.includes('24') ? '6-8 hours' : '4-6 hours',
    difficulty: course.rating >= 4.8 ? 'Intermediate' : 'Beginner-friendly',
    deliverables: blueprint.deliverables,
    milestones: blueprint.milestones,
    rubric: [
      'Problem clarity and relevance to a real Nigerian or global use case',
      'Quality and completeness of the final artifact',
      'Evidence of testing, iteration, and practical judgment',
      'Clear documentation that another learner can understand',
    ],
    submissionFormat: 'Submit a link to your project, a short write-up, and any supporting screenshots or files.',
  };
}
