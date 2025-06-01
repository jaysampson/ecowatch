
'use server';
/**
 * @fileOverview A predictive maintenance AI agent for the EcoWatch SmartGrid system.
 *
 * - getSystemMaintenancePrediction - A function that analyzes device data for maintenance predictions.
 * - PredictiveMaintenanceInput - The input type for the getSystemMaintenancePrediction function.
 * - PredictiveMaintenanceOutput - The return type for the getSystemMaintenancePrediction function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define a Zod schema that mirrors the Device type from src/types/index.ts
const DeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Inverter', 'Battery', 'Solar Panel']),
  status: z.enum(['Online', 'Offline', 'Warning']),
  power: z.number().optional().describe('in kW for panels/inverters'),
  capacity: z.number().optional().describe('in kWh for batteries'),
  chargeLevel: z.number().optional().describe('percentage for batteries'),
  health: z.number().optional().describe('percentage of remaining life/performance'),
  temperature: z.number().optional().describe('in Celsius'),
});
export type DeviceType = z.infer<typeof DeviceSchema>;

const PredictiveMaintenanceInputSchema = z.object({
  devices: z.array(DeviceSchema).describe('An array of device objects with their current operational data.'),
});
export type PredictiveMaintenanceInput = z.infer<typeof PredictiveMaintenanceInputSchema>;

const CriticalDevicePredictionSchema = z.object({
  deviceId: z.string().describe('The ID of the critical device.'),
  deviceName: z.string().describe('The name of the critical device.'),
  prediction: z.string().describe('A concise statement about the potential issue and recommended check timeframe.'),
  reasoning: z.string().describe('A brief explanation for the prediction.'),
  recommendedActions: z.array(z.string()).describe('A list of specific actions to take for this device.'),
});

const PredictiveMaintenanceOutputSchema = z.object({
  overallSystemHealth: z.string().describe('An overall system health status (e.g., "Optimal", "Minor Concerns", "Action Required").'),
  criticalDevices: z.array(CriticalDevicePredictionSchema).describe('A list of devices identified as critical, with their specific predictions and recommendations. Empty if no devices are critical.'),
  generalRecommendations: z.array(z.string()).describe('A list of general recommendations for maintaining overall system health.'),
});
export type PredictiveMaintenanceOutput = z.infer<typeof PredictiveMaintenanceOutputSchema>;


const maintenancePrompt = ai.definePrompt({
  name: 'predictiveMaintenancePrompt',
  input: { schema: PredictiveMaintenanceInputSchema },
  output: { schema: PredictiveMaintenanceOutputSchema },
  prompt: `You are an expert AI assistant for an EcoWatch SmartGrid system, specializing in predictive maintenance.
Your task is to analyze the current status of all connected energy devices and provide a detailed maintenance assessment.

Input: A list of devices with their current operational data:
{{#each devices}}
- Device ID: {{id}}
  Name: {{name}}
  Type: {{type}}
  Status: {{status}}
  {{#if power}}Power Output: {{power}} kW{{/if}}
  {{#if chargeLevel}}Charge Level: {{chargeLevel}}%{{/if}}
  {{#if health}}Health: {{health}}%{{/if}}
  {{#if temperature}}Temperature: {{temperature}}°C{{/if}}
{{/each}}

Based on the provided device data, please:
1.  Determine an "overallSystemHealth" status. This should be one of: "Optimal", "Good", "Minor Concerns", "Action Required", or "Critical Alert".
2.  Identify any "criticalDevices" that require immediate or near-term attention. For each critical device, provide:
    *   \`deviceId\`: The ID of the device.
    *   \`deviceName\`: The name of the device.
    *   \`prediction\`: A concise statement about the potential issue (e.g., "Elevated temperature detected", "Low power output and declining health"). Also include a recommended check timeframe (e.g., "Recommend inspection within 1 week.", "Immediate check advised.").
    *   \`reasoning\`: A brief explanation for your prediction, citing specific data points (e.g., "Temperature is 15°C above typical operating range (current: {{temperature}}°C) and health is below 70% (current: {{health}}%).", "Power output ({{power}} kW) is 30% lower than expected for current conditions and status is 'Warning'.").
    *   \`recommendedActions\`: A list of 2-3 specific, actionable steps (e.g., ["Check for obstructions on solar panel surface.", "Verify inverter cooling fan is operational and clear of debris.", "Schedule a comprehensive battery health check with a technician."]).
    If no devices are deemed critical, this list must be empty.
3.  Provide a list of 2-3 "generalRecommendations" for maintaining or improving overall system health based on the current snapshot. These should be actionable tips relevant to the provided device data.

Consider these factors for your assessment:
-   **General**: A 'Warning' status is a strong indicator of a problem. Low 'health' (e.g., below 75-80%) always warrants attention, and below 60% can be critical depending on the device type and other factors.
-   **Solar Panels**: Low 'power' output when 'Online' is a concern. High 'temperature' (e.g., consistently above 45-50°C) can indicate issues like poor ventilation or degradation.
-   **Batteries**: Erratic 'chargeLevel' behavior, inability to hold full charge, or rapid discharge. 'Health' is key. High 'temperature' (e.g., above 35-40°C during normal operation) is detrimental.
-   **Inverters**: Inconsistent or significantly lower than expected 'power' output. 'Health' and 'temperature' are critical indicators. Inverters are central to system operation.

Focus on providing practical, clear, and actionable advice. Ensure your output strictly adheres to the defined JSON schema.
`,
});

const predictiveMaintenanceFlow = ai.defineFlow(
  {
    name: 'predictiveMaintenanceFlow',
    inputSchema: PredictiveMaintenanceInputSchema,
    outputSchema: PredictiveMaintenanceOutputSchema,
  },
  async (input) => {
    // In a real scenario, you might fetch more historical data here based on device IDs
    // For now, we directly use the current device snapshot
    const { output } = await maintenancePrompt(input);
    if (!output) {
        throw new Error("AI failed to generate maintenance prediction.");
    }
    return output;
  }
);

export async function getSystemMaintenancePrediction(input: PredictiveMaintenanceInput): Promise<PredictiveMaintenanceOutput> {
  return predictiveMaintenanceFlow(input);
}

