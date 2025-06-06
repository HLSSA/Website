import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const UpcomingMatches = () => {
  const matches = [
    {
      id: 1,
      opponent: "Sunrise FC",
      date: "28 JUN 2025",
      time: "4:30 PM",
      location: "Gachibowli Stadium, Hyderabad",
      isHome: true,
      status: "upcoming"
    },
    {
      id: 2,
      opponent: "Victory United",
      date: "05 JUL 2025",
      time: "6:00 PM",
      location: "Kompally Sports Complex",
      isHome: false,
      status: "upcoming"
    },
    {
      id: 3,
      opponent: "Elite Academy",
      date: "12 JUL 2025",
      time: "5:15 PM",
      location: "HLSSA Home Ground",
      isHome: true,
      status: "upcoming"
    },
    {
      id: 4,
      opponent: "Champions FC",
      date: "19 JUL 2025",
      time: "4:45 PM",
      location: "Nizampet Football Arena",
      isHome: false,
      status: "upcoming"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Matches</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Follow our journey as we compete against the best teams in Hyderabad
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-6">
                {/* Match Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    match.isHome 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {match.isHome ? 'HOME' : 'AWAY'}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">HLSSA</span>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">HLSSA</div>
                  </div>
                  
                  <div className="mx-4">
                    <div className="text-2xl font-bold text-gray-400">VS</div>
                  </div>
                  
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-gray-600 font-bold text-xs">⚽</span>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">{match.opponent}</div>
                  </div>
                </div>

                {/* Match Details */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{match.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{match.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{match.location}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 bg-yellow-400 text-blue-900 py-2 px-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-sm">
                  View on Map
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
            View Full Schedule
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingMatches;