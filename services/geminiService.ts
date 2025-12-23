
import { GoogleGenAI, Type } from "@google/genai";
import { BudgetInputs, BudgetAdvice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getBudgetAdvice = async (inputs: BudgetInputs): Promise<BudgetAdvice> => {
  const prompt = `
    Analyze this user's monthly financial data and provide a detailed budget report.
    
    Data:
    - Monthly Income: ₹${inputs.income}
    - Rent: ₹${inputs.rent}
    - Food: ₹${inputs.food}
    - Travel: ₹${inputs.travel}
    - Loans: ₹${inputs.loans}
    - Shopping: ₹${inputs.shopping}
    - Entertainment: ₹${inputs.entertainment}
    - Luxury: ₹${inputs.luxury}

    Classification Rules:
    - Needs: rent, food, travel, loans
    - Wants: shopping, entertainment, luxury
    - Savings: income - (needs + wants)

    Alert Rules:
    - Warn if food > 30% of income
    - Warn if wants > 20% of income
    - Warn if savings < 10% of income
    - Praise if savings >= ₹2000

    Prediction Rule:
    - Estimate next month expenses with a 5% increase per category.

    Be accurate and numerically consistent. Use simple language.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.OBJECT,
            properties: {
              income: { type: Type.NUMBER },
              total_expenses: { type: Type.NUMBER },
              savings: { type: Type.NUMBER },
            },
            required: ["income", "total_expenses", "savings"],
          },
          categories: {
            type: Type.OBJECT,
            properties: {
              needs: { type: Type.NUMBER },
              wants: { type: Type.NUMBER },
              savings: { type: Type.NUMBER },
            },
            required: ["needs", "wants", "savings"],
          },
          alerts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          next_month_prediction: {
            type: Type.OBJECT,
            properties: {
              rent: { type: Type.NUMBER },
              food: { type: Type.NUMBER },
              travel: { type: Type.NUMBER },
              loans: { type: Type.NUMBER },
              wants: { type: Type.NUMBER },
              estimated_total: { type: Type.NUMBER },
              estimated_savings: { type: Type.NUMBER },
            },
            required: ["rent", "food", "travel", "loans", "wants", "estimated_total", "estimated_savings"],
          },
        },
        required: ["summary", "categories", "alerts", "suggestions", "next_month_prediction"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as BudgetAdvice;
};
