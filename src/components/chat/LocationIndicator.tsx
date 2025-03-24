
import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationIndicatorProps {
  location: string;
}

const LocationIndicator: React.FC<LocationIndicatorProps> = ({ location }) => {
  if (!location || location.trim() === '') return null;
  
  return (
    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center">
      <MapPin size={16} className="text-healthcare-blue mr-1" />
      <span className="text-sm text-gray-600">Using location: {location}</span>
    </div>
  );
};

export default LocationIndicator;
