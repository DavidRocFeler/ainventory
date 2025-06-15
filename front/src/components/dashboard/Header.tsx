import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onAddProduct: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddProduct }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleRedirectToLink = () => {
    window.location.href = 'https://www.casasarda.nl'
  }

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (option: string) => {
    if (option === 'kitchen') {
      navigate('/support');
    }
    setIsDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <div>
          <img src="/CasaSarda.png" alt="Logo" className='w-[12rem]'
          onClick={handleRedirectToLink}
          />
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 text-[1rem] font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              Inventory Bar Dashboard
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            
            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-[-1.2rem] bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[200px]">
                <button
                  onClick={() => handleOptionSelect('bar')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Dashboard Inventory Bar
                </button>
                <button
                  onClick={() => handleOptionSelect('kitchen')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Dashboard Inventory Kitchen
                </button>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={onAddProduct}
          className="ml-auto bg-gray-900 hover:bg-gray-800 text-white rounded-full h-12 w-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus size={24} />
        </Button>
      </div>
    </header>
  );
};