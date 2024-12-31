'use client'

import { useState } from 'react';
import { PRESET_TAGS } from '@/constants/site';

interface TagSelectorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelector({ tags, onChange }: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInputValue('');
    setShowDropdown(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const filteredPresetTags = PRESET_TAGS.filter(tag => 
    tag.toLowerCase().includes(inputValue.toLowerCase()) &&
    !tags.includes(tag)
  );

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full p-2 border rounded"
          placeholder="添加标签..."
        />

        {showDropdown && (inputValue || filteredPresetTags.length > 0) && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {inputValue && !PRESET_TAGS.includes(inputValue) && (
              <button
                onClick={() => handleAddTag(inputValue)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                添加 "{inputValue}"
              </button>
            )}
            
            {filteredPresetTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 