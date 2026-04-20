const articles = [
  { author: 'Rahul Verma', city: 'Mumbai', title: 'Ready-to-Move-in vs Under-Construction Properties: Complete Guide 2024', date: 'Apr 2026' },
  { author: 'Priya Nair', city: 'Bangalore', title: 'Buying Property in Bangalore: 2026 Homebuyer Guide for IT Professionals', date: 'Apr 2026' },
  { author: 'Amit Joshi', city: 'Pune', title: 'Why Families Are Preferring Pune Suburbs: Livability & Education Guide', date: 'Apr 2026' },
];

export default function ArticlesSection() {
  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recent Articles</h2>
            <p className="text-gray-500 text-sm">Knowledge centre</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((a, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
              <div className="h-36 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-5xl">
                📰
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400">By {a.author}</span>
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{a.city}</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-red-600 transition line-clamp-2">{a.title}</h3>
                <p className="text-xs text-gray-400 mt-2">Last updated on {a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
