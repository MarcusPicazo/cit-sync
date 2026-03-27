import { z } from 'zod';

const getOneWeekFromToday = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const zNum = n => ('0' + n).slice(-2);
  return d.getFullYear() + '-' + zNum(d.getMonth() + 1) + '-' + zNum(d.getDate());
};

export const appRequestSchema = z.object({
  projectName: z.string().min(3, "Min 3 characters."),
  experienceType: z.enum([
    'Web Interactiva / Dashboard', 'Minijuego / Gamificación', 'Simulador 3D',
    'Realidad Aumentada (AR)', 'Realidad Virtual (VR)', 'Examen con IA', 'Otra'
  ], { required_error: "Select an experience type." }),
  description: z.string().min(20, "Please provide more details (min 20 char)."),
  targetAudience: z.enum(['Preescolar', 'Primaria', 'Secundaria', 'Preparatoria', 'Universidad']),
  deliveryDate: z.string()
    .min(1, "Select an estimated delivery date.")
    .refine(val => val >= getOneWeekFromToday(), { message: "Apps must be requested at least 1 week in advance."}),
  topicsMethod: z.enum(['manual', 'file']).default('manual'),
  topics: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  aiFeedback: z.boolean().optional(),
  referenceLinks: z.string().optional(),
  visualTheme: z.string().optional(),
  academicGrade: z.string().optional(),
  questionTypes: z.array(z.string()).optional()
});