import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Filter, Store, Search, Map, List, Star, Navigation } from 'lucide-react';

// Sample store data with real coordinates around Allendale, MI
const storeData = [
  {
    id: 1,
    name: "Tokyo Mart",
    type: "Japanese",
    address: "4855 Lake Michigan Dr, Allendale, MI 49401",
    phone: "(616) 895-4567",
    hours: "9 AM - 8 PM",
    lat: 42.9734,
    lng: -85.8681,
    description: "Authentic Japanese groceries, fresh sushi, ramen supplies, mochi",
    rating: 4.8,
    specialties: ["Sushi Grade Fish", "Ramen", "Mochi", "Japanese Snacks"]
  },
  {
    id: 2,
    name: "Spice Bazaar",
    type: "Indian",
    address: "4724 Wilson Ave, Allendale, MI 49401",
    phone: "(616) 895-5678",
    hours: "10 AM - 9 PM",
    lat: 42.9634,
    lng: -85.8781,
    description: "Wide selection of spices, lentils, basmati rice, Indian snacks",
    rating: 4.9,
    specialties: ["Spices", "Dal", "Basmati Rice", "Papadums"]
  },
  {
    id: 3,
    name: "Dragon Market",
    type: "Chinese",
    address: "4950 Lake Michigan Dr, Allendale, MI 49401",
    phone: "(616) 895-6789",
    hours: "8 AM - 10 PM",
    lat: 42.9834,
    lng: -85.8581,
    description: "Fresh produce, dim sum supplies, tea selection, noodles",
    rating: 4.7,
    specialties: ["Dim Sum", "Fresh Vegetables", "Chinese Tea", "Noodles"]
  },
  {
    id: 4,
    name: "Seoul Foods",
    type: "Korean",
    address: "10440 48th Ave, Allendale, MI 49401",
    phone: "(616) 895-7890",
    hours: "9 AM - 9 PM",
    lat: 42.9534,
    lng: -85.8881,
    description: "Korean BBQ ingredients, kimchi, gochujang, K-snacks, soju",
    rating: 4.6,
    specialties: ["Korean BBQ", "Kimchi", "Gochujang", "K-Snacks"]
  },
  {
    id: 5,
    name: "Thai Treasure",
    type: "Thai",
    address: "4846 Lake Michigan Dr, Allendale, MI 49401",
    phone: "(616) 895-8901",
    hours: "10 AM - 8 PM",
    lat: 42.9434,
    lng: -85.8481,
    description: "Thai curry pastes, coconut products, exotic fruits, fish sauce",
    rating: 4.5,
    specialties: ["Curry Paste", "Coconut Milk", "Thai Basil", "Fish Sauce"]
  },
  {
    id: 6,
    name: "Saigon Market",
    type: "Vietnamese",
    address: "10390 48th Ave, Allendale, MI 49401",
    phone: "(616) 895-9012",
    hours: "9 AM - 9 PM",
    lat: 42.9334,
    lng: -85.8381,
    description: "Pho ingredients, Vietnamese coffee, banh mi supplies, herbs",
    rating: 4.7,
    specialties: ["Pho Noodles", "Vietnamese Coffee", "Fresh Herbs", "Fish Sauce"]
  }
];

const cuisineTypes = ["All", "Japanese", "Chinese", "Indian", "Korean", "Thai", "Vietnamese"];

const cuisineColors = {
  Japanese: "bg-red-100 text-red-700 border-red-300",
  Chinese: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Indian: "bg-orange-100 text-orange-700 border-orange-300",
  Korean: "bg-pink-100 text-pink-700 border-pink-300",
  Thai: "bg-green-100 text-green-700 border-green-300",
  Vietnamese: "bg-blue-100 text-blue-700 border-blue-300"
};

// Simple map marker component
const MapMarker = ({ store, isSelected, onClick }) => {
  const colors = {
    Japanese: '#dc2626',
    Chinese: '#ca8a04',
    Indian: '#ea580c',
    Korean: '#db2777',
    Thai: '#16a34a',
    Vietnamese: '#2563eb'
  };

  return (
    <div 
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${((store.lng + 85.8681) * 10000)}px`,
        top: `${((42.9734 - store.lat) * 10000)}px`,
        transform: 'translate(-50%, -100%)',
        cursor: 'pointer',
        zIndex: isSelected ? 1000 : 1
      }}
    >
      <div style={{
        width: isSelected ? '36px' : '28px',
        height: isSelected ? '36px' : '28px',
        backgroundColor: colors[store.type],
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        border: '3px solid white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Store 
          style={{
            transform: 'rotate(45deg)',
            color: 'white',
            width: isSelected ? '18px' : '14px',
            height: isSelected ? '18px' : '14px'
          }}
        />
      </div>
      {isSelected && (
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          whiteSpace: 'nowrap',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {store.name}
        </div>
      )}
    </div>
  );
};

export default function EasternAisles() {
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'map'
  const [sortBy, setSortBy] = useState("name"); // 'name', 'rating', 'type'

  // Filter stores based on selected cuisine and search term
  const filteredStores = storeData.filter(store => {
    const matchesCuisine = selectedCuisine === "All" || store.type === selectedCuisine;
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCuisine && matchesSearch;
  });

  // Sort filtered stores
  const sortedStores = [...filteredStores].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "type") return a.type.localeCompare(b.type);
    return a.name.localeCompare(b.name);
  });

  // Auto-scroll to selected store
  useEffect(() => {
    if (selectedStore && viewMode === "grid") {
      const element = document.getElementById(`store-${selectedStore.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedStore, viewMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-orange-400 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Store className="w-10 h-10 text-orange-600" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Eastern Aisles
                </h1>
                <p className="text-gray-600 text-xs md:text-sm">Discover Asian Groceries Near You</p>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  viewMode === "grid" 
                    ? 'bg-white text-orange-600 shadow-md' 
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  viewMode === "map" 
                    ? 'bg-white text-orange-600 shadow-md' 
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6 border-2 border-orange-200">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stores, cuisine, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Cuisine Filter Buttons */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700 text-sm md:text-base">Filter by Cuisine:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.map(cuisine => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3 md:px-5 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-sm ${
                    selectedCuisine === cuisine
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-700 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="type">Cuisine Type</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-center">
          <p className="text-base md:text-lg text-gray-700">
            Found <span className="font-bold text-orange-600">{sortedStores.length}</span> store{sortedStores.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {sortedStores.map((store, index) => (
              <div
                key={store.id}
                id={`store-${store.id}`}
                onClick={() => setSelectedStore(selectedStore?.id === store.id ? null : store)}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 overflow-hidden ${
                  selectedStore?.id === store.id ? 'border-orange-500 ring-4 ring-orange-200' : 'border-transparent hover:border-orange-400'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Store Type Badge */}
                <div className={`px-4 py-2 border-b-2 flex items-center justify-between ${cuisineColors[store.type]}`}>
                  <span className="font-semibold text-sm">{store.type} Cuisine</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-sm">{store.rating}</span>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  {/* Store Name */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{store.name}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed">{store.description}</p>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {store.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-xs">{store.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="text-gray-700 text-xs">{store.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="text-gray-700 text-xs">{store.hours}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedStore?.id === store.id && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`, '_blank');
                        }}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        Get Directions
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewMode("map");
                        }}
                        className="w-full bg-white border-2 border-orange-500 text-orange-600 font-semibold py-3 rounded-xl hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Map className="w-4 h-4" />
                        View on Map
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map View */}
        {viewMode === "map" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200">
            <div className="relative" style={{ height: '600px', backgroundColor: '#f0f0f0' }}>
              {/* Simple map background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
                {/* Grid lines for map effect */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }}></div>
                
                {/* Center reference */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">
                  Allendale, MI
                </div>

                {/* Map markers */}
                {sortedStores.map(store => (
                  <MapMarker
                    key={store.id}
                    store={store}
                    isSelected={selectedStore?.id === store.id}
                    onClick={() => setSelectedStore(selectedStore?.id === store.id ? null : store)}
                  />
                ))}
              </div>

              {/* Selected store info card */}
              {selectedStore && (
                <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-96 bg-white rounded-xl shadow-2xl p-4 border-2 border-orange-400 z-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedStore.name}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${cuisineColors[selectedStore.type]}`}>
                        {selectedStore.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold text-sm">{selectedStore.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{selectedStore.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{selectedStore.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-700">{selectedStore.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-700">{selectedStore.hours}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStore.address)}`, '_blank')}
                    className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {sortedStores.length === 0 && (
          <div className="text-center py-16">
            <Store className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Stores Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-orange-400 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm md:text-base">
            Built with ❤️ for the Asian grocery community
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">
            Eastern Aisles © 2025 | Your First Project
          </p>
        </div>
      </footer>
    </div>
  );
}

/* 
to run the code:
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose  */
