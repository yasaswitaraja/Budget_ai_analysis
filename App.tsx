
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

// Updated high-contrast, professional palette
// [Needs (Indigo), Wants (Amber), Savings (Emerald)]
const COLORS = ['#4f46e5', '#f59e0b', '#10b981'];

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
      name: 'Expenses',
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
    <div className="min-h-screen pb-12 bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Wallet className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
              AI Budget <span className="text-indigo-600">Advisor</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Panel */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <Coins className="text-indigo-600 w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Financial Entries</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Primary Income
                  </h3>
                  <InputGroup
                    label="Monthly Income"
                    name="income"
                    value={inputs.income}
                    onChange={handleInputChange}
                    icon={<Sparkles className="w-4 h-4 text-emerald-500" />}
                    colorClass="text-emerald-600"
                    focusClass="focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Essential Needs
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <InputGroup label="Rent" name="rent" value={inputs.rent} onChange={handleInputChange} icon={<Home className="w-4 h-4 text-indigo-500" />} colorClass="text-indigo-600" focusClass="focus:ring-indigo-500" />
                    <InputGroup label="Food" name="food" value={inputs.food} onChange={handleInputChange} icon={<Utensils className="w-4 h-4 text-indigo-500" />} colorClass="text-indigo-600" focusClass="focus:ring-indigo-500" />
                    <InputGroup label="Travel" name="travel" value={inputs.travel} onChange={handleInputChange} icon={<Plane className="w-4 h-4 text-indigo-500" />} colorClass="text-indigo-600" focusClass="focus:ring-indigo-500" />
                    <InputGroup label="Loans" name="loans" value={inputs.loans} onChange={handleInputChange} icon={<CreditCard className="w-4 h-4 text-indigo-500" />} colorClass="text-indigo-600" focusClass="focus:ring-indigo-500" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Discretionary Wants
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <InputGroup label="Shopping" name="shopping" value={inputs.shopping} onChange={handleInputChange} icon={<ShoppingCart className="w-4 h-4 text-amber-500" />} colorClass="text-amber-600" focusClass="focus:ring-amber-500" />
                    <InputGroup label="Entertainment" name="entertainment" value={inputs.entertainment} onChange={handleInputChange} icon={<PieIcon className="w-4 h-4 text-amber-500" />} colorClass="text-amber-600" focusClass="focus:ring-amber-500" />
                    <InputGroup label="Luxury" name="luxury" value={inputs.luxury} onChange={handleInputChange} icon={<Sparkles className="w-4 h-4 text-amber-500" />} colorClass="text-amber-600" focusClass="focus:ring-amber-500" />
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-4 px-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      Generate Advisor Insights
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Results Panel */}
          <section className="lg:col-span-8 space-y-6">
            {!advice && !loading && !error && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="bg-indigo-50 p-6 rounded-full mb-6">
                  <ShieldCheck className="w-16 h-16 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Financial Intelligence Awaits</h3>
                <p className="text-gray-500 max-w-sm mt-3 leading-relaxed">
                  Submit your budget details and our AI will categorize your spending, flag concerns, and predict your financial future.
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {loading && (
              <div className="h-96 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                  <div className="absolute inset-0 m-auto w-8 h-8 bg-indigo-100 rounded-full animate-pulse"></div>
                </div>
                <div className="text-center">
                  <p className="text-gray-800 text-lg font-bold">Analyzing your data...</p>
                  <p className="text-gray-400 text-sm">Classifying needs, wants and identifying patterns.</p>
                </div>
              </div>
            )}

            {advice && !loading && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group transition-all hover:border-emerald-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Savings</p>
                    <p className={`text-3xl font-black ${advice.summary.savings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ₹{advice.summary.savings.toLocaleString()}
                    </p>
                    <div className="mt-2 h-1 w-full bg-emerald-50 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(0, (advice.summary.savings / advice.summary.income) * 100))}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Spending</p>
                    <p className="text-3xl font-black text-gray-900">
                      ₹{advice.summary.total_expenses.toLocaleString()}
                    </p>
                    <div className="mt-2 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (advice.summary.total_expenses / advice.summary.income) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Savings Rate</p>
                    <p className="text-3xl font-black text-indigo-600">
                      {Math.max(0, Math.round((advice.summary.savings / advice.summary.income) * 100))}%
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">of total monthly income</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Expense Distribution */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[380px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <PieIcon className="w-5 h-5 text-indigo-500" />
                        Allocation
                      </h3>
                      <div className="flex gap-2">
                        {COLORS.map((c, i) => (
                           <div key={i} className="w-2 h-2 rounded-full" style={{backgroundColor: c}}></div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Future Prediction */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[380px] flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      Prediction (Next Mo.)
                    </h3>
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                          <Legend iconType="rect" />
                          <Bar dataKey="current" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Current Month" />
                          <Bar dataKey="predicted" fill="#4f46e5" radius={[6, 6, 0, 0]} name="AI Projected" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Alerts */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                      Risk Assessment
                    </h3>
                    <div className="space-y-4">
                      {advice.alerts.length > 0 ? (
                        advice.alerts.map((alert, i) => (
                          <div key={i} className="flex gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-sm text-rose-700 font-medium">
                            <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {alert}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-emerald-600 font-bold p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5" />
                          Budget health is excellent. No critical risks found.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      Strategic Advice
                    </h3>
                    <div className="space-y-4">
                      {advice.suggestions.map((sug, i) => (
                        <div key={i} className="flex gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm text-indigo-700 font-medium group transition-all hover:bg-indigo-100">
                          <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-400" />
                          {sug}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Prediction Breakdown */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      Projected Itemization
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider italic">AI Optimized</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Rent</p>
                      <p className="text-xl font-black text-gray-900">₹{advice.next_month_prediction.rent.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Food</p>
                      <p className="text-xl font-black text-gray-900">₹{advice.next_month_prediction.food.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Travel</p>
                      <p className="text-xl font-black text-gray-900">₹{advice.next_month_prediction.travel.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Loans</p>
                      <p className="text-xl font-black text-gray-900">₹{advice.next_month_prediction.loans.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                      <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest mb-1">Wants</p>
                      <p className="text-xl font-black text-amber-600">₹{advice.next_month_prediction.wants.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest mb-1">Next Sav.</p>
                      <p className="text-xl font-black text-emerald-700">₹{advice.next_month_prediction.estimated_savings.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
        <div className="flex items-center justify-center gap-4 mb-4 opacity-50">
           <div className="h-px w-12 bg-gray-300"></div>
           <Wallet className="w-4 h-4" />
           <div className="h-px w-12 bg-gray-300"></div>
        </div>
        <p>© {new Date().getFullYear()} AI Budget Advisor • Intelligence by Gemini 3</p>
      </footer>
    </div>
  );
};

export default App;
