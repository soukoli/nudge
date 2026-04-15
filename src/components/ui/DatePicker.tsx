'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import { cs, enUS } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-day-picker/style.css';

export interface DatePickerProps {
  label?: string;
  value?: string; // ISO date string YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select date...',
  error,
  disabled = false,
}: DatePickerProps) {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dateLocale = locale === 'cs' ? cs : enUS;
  const dateFormat = locale === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy';
  
  // Parse value to Date
  const selectedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;

  // Update input value when value changes
  useEffect(() => {
    if (selectedDate && isValid(selectedDate)) {
      setInputValue(format(selectedDate, dateFormat, { locale: dateLocale }));
    } else {
      setInputValue('');
    }
  }, [value, dateFormat, dateLocale, selectedDate]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDaySelect = (day: Date | undefined) => {
    if (day) {
      onChange(format(day, 'yyyy-MM-dd'));
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to parse the input
    const parsed = parse(newValue, dateFormat, new Date());
    if (isValid(parsed)) {
      onChange(format(parsed, 'yyyy-MM-dd'));
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    onChange('');
    setInputValue('');
    setIsOpen(false);
  };

  const defaultClassNames = getDefaultClassNames();

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      {label && (
        <label className="label">{label}</label>
      )}
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] z-10">
          <Calendar size={18} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`input pl-12 pr-10 ${error ? 'border-[var(--color-error)]' : ''}`}
        />

        {inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-[var(--color-error)]">{error}</p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] bottom-full mb-2 left-0"
          >
            <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-2xl p-3">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDaySelect}
                locale={dateLocale}
                showOutsideDays
                classNames={{
                  root: `${defaultClassNames.root} rdp-custom`,
                  today: 'rdp-today',
                  selected: 'rdp-selected',
                  chevron: `${defaultClassNames.chevron} fill-[var(--color-primary)]`,
                  day_button: 'rdp-day-button',
                  day: 'rdp-day',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
