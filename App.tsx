
import React, { useState, useCallback } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { 
  Wallet, TrendingUp, AlertTriangle, Lightbulb, PieChart as PieIcon, 
  ArrowRight, ShieldCheck, ShoppingCart, Home, Utensils, Plane, 
  CreditCard, Sparkles, Loader2, Coins
} from 'lucide-react';
import { BudgetInputs, BudgetAdvice } from './types';
import { getBudgetAdvice } from './services/geminiService';
import { InputGroup } from './components/InputGroup';

const COLORS = ['#3b82f6', '#ef4444', '#10b981'];

const App: React.FC = () => {
  const [inputs, setInputs] = useState<BudgetInputs>({
    income: 25000,
    rent: 8000,
    food: 5000,
    travel: 2000,
    loans: 1000,
    shopping: 3000,
    entertainment: 1500,
    luxury: 500,
  });

  const [advice, setAdvice] = useState<BudgetAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBudgetAdvice(inputs);
      setAdvice(result);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch advice. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const pieData = advice ? [
    { name: 'Needs', value: advice.categories.needs },
    { name: 'Wants', value: advice.categories.wants },
    { name: 'Savings', value: advice.categories.savings > 0 ? advice.categories.savings : 0 }
  ] : [];

  const comparisonData = advice ? [
    {
      name: 'Total Expenses',
      current: advice.summary.total_expenses,
      predicted: advice.next_month_prediction.estimated_total
    },
    {
      name: 'Savings',
      current: advice.summary.savings,
      predicted: advice.next_month_prediction.estimated_savings
    }
  ] : [];

  return (
    <div className="min-h-screen pb-12 bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wallet className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              AI Budget Advisor
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Panel */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Coins className="text-blue-500 w-5 h-5" />
                <h2 className="text-lg font-semibold">Your Financials</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Income</h3>
                  <InputGroup
                    label="Monthly Income"
                    name="income"
                    value={inputs.income}
                    onChange={handleInputChange}
                    icon={<Sparkles className="w-4 h-4 text-amber-500" />}
                  />
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Needs</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <InputGroup label="Rent" name="rent" value={inputs.rent} onChange={handleInputChange} icon={<Home className="w-4 h-4 text-blue-400" />} />
                    <InputGroup label="Food" name="food" value={inputs.food} onChange={handleInputChange} icon={<Utensils className="w-4 h-4 text-blue-400" />} />
                    <InputGroup label="Travel" name="travel" value={inputs.travel} onChange={handleInputChange} icon={<Plane className="w-4 h-4 text-blue-400" />} />
                    <InputGroup label="Loans" name="loans" value={inputs.loans} onChange={handleInputChange} icon={<CreditCard className="w-4 h-4 text-blue-400" />} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Wants</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <InputGroup label="Shopping" name="shopping" value={inputs.shopping} onChange={handleInputChange} icon={<ShoppingCart className="w-4 h-4 text-pink-400" />} />
                    <InputGroup label="Entertainment" name="entertainment" value={inputs.entertainment} onChange={handleInputChange} icon={<PieIcon className="w-4 h-4 text-pink-400" />} />
                    <InputGroup label="Luxury" name="luxury" value={inputs.luxury} onChange={handleInputChange} icon={<Sparkles className="w-4 h-4 text-pink-400" />} />
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      Get AI Advice
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Results Panel */}
          <section className="lg:col-span-8 space-y-6">
            {!advice && !loading && !error && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                  <ShieldCheck className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ready for Analysis</h3>
                <p className="text-gray-500 max-w-sm mt-2">
                  Enter your monthly income and expenses to see AI-powered insights and next-month predictions.
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {loading && (
              <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Consulting your AI Advisor...</p>
              </div>
            )}

            {advice && !loading && (
              <div className="space-y-6 animate-in fade-in duration-500">
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-400">Monthly Savings</p>
                    <p className={`text-2xl font-bold mt-1 ${advice.summary.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{advice.summary.savings.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-400">Total Expenses</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">
                      ₹{advice.summary.total_expenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-400">Budget Health</p>
                    <p className="text-2xl font-bold mt-1 text-blue-600">
                      {Math.round((advice.summary.savings / advice.summary.income) * 100)}% Saved
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Expense Distribution */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[350px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <PieIcon className="w-5 h-5 text-blue-500" />
                      Expense Distribution
                    </h3>
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Future Prediction */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[350px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
                      Next Month (5% Increase)
                    </h3>
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="current" fill="#94a3b8" radius={[4, 4, 0, 0]} name="This Month" />
                          <Bar dataKey="predicted" fill="#6366f1" radius={[4, 4, 0, 0]} name="Predicted" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Alerts */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Alerts & Observations
                    </h3>
                    <div className="space-y-3">
                      {advice.alerts.length > 0 ? (
                        advice.alerts.map((alert, i) => (
                          <div key={i} className="flex gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                            <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {alert}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-lg">No critical alerts detected. Good job!</div>
                      )}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      Financial Suggestions
                    </h3>
                    <div className="space-y-3">
                      {advice.suggestions.map((sug, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                          <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {sug}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Prediction Breakdown */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    Predicted Itemized Expenses
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Rent</p>
                      <p className="text-lg font-bold">₹{advice.next_month_prediction.rent}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Food</p>
                      <p className="text-lg font-bold">₹{advice.next_month_prediction.food}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Travel</p>
                      <p className="text-lg font-bold">₹{advice.next_month_prediction.travel}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Loans</p>
                      <p className="text-lg font-bold">₹{advice.next_month_prediction.loans}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Wants</p>
                      <p className="text-lg font-bold">₹{advice.next_month_prediction.wants}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                      <p className="text-xs text-indigo-500 uppercase font-bold tracking-tighter">Next Sav.</p>
                      <p className="text-lg font-bold text-indigo-700">₹{advice.next_month_prediction.estimated_savings}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Persistent CTA - Info section at bottom for desktop, floating at top for mobile if needed, but we used standard responsive flow here */}
      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} AI Budget Planner • Powered by Gemini 3</p>
      </footer>
    </div>
  );
};

export default App;
