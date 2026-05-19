'use client'

import React, { useState, useRef, ChangeEvent } from 'react'
import InputEditIcon from '../icons/settings/InputEditIcon'
import CustomDropdown from '../reusable/CustomDropdown'
 

interface FormData {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  country: string
  state: string
}

interface DropdownOption {
  value: string
  label: string
}

export default function SettingsHome() {
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    country: 'US',
    state: '',
  })
  
  // State for image upload
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string>('')
  
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Original data for cancel functionality
  const [originalData] = useState<FormData & { profileImage: File | null }>({ 
    ...formData, 
    profileImage: null 
  })
  
  // Dropdown options with proper typing
  const countryOptions: DropdownOption[] = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'IN', label: 'India' },
  ]

  const stateOptions: DropdownOption[] = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
    { value: 'PA', label: 'Pennsylvania' },
  ]

  // Handle image upload
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setUploadError('')
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      setUploadError('Only JPEG and PNG files are allowed')
      return
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB')
      return
    }
    
    // Set the image
    setProfileImage(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Trigger file input click
  const triggerFileInput = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle text input changes
  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof FormData): void => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  // Handle save
  const handleSave = (): void => {
    // Save form data and image
    console.log('Form data:', formData)
    console.log('Profile image:', profileImage)
    
    // Here you would typically make an API call
    alert('Profile saved successfully!')
  }

  // Handle cancel
  const handleCancel = (): void => {
    // Reset form data
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      country: 'US',
      state: '',
    })
    
    // Reset image
    setProfileImage(null)
    setImagePreview(null)
    setUploadError('')
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Remove image
  const removeImage = (): void => {
    setProfileImage(null)
    setImagePreview(null)
    setUploadError('')
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className='bg-[#0E121B] p-6 rounded-[24px]'>
      <h2 className='text-white text-2xl font-semibold'>My Profile</h2>
      
      {/* Profile Photo Section - EXACTLY LIKE BEFORE */}
      <div className='flex items-center gap-4 mt-4.5'>
        <div className='h-10 w-10 rounded-full bg-[#181a25] overflow-hidden'>
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt='profile-preview' 
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              {/* Image placeholder - no text */}
            </div>
          )}
        </div>
        
        <div>
          <h3 className='text-white text-sm font-bold'>Profile Photo</h3>
          <p className='text-xs text-[#A5A5AB]'>Min 400x400px, PNG or JPEG formats.</p>
        </div>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/jpeg,image/png"
          className="hidden"
        />
        
        {/* Upload/Change button */}
        <button 
          onClick={triggerFileInput}
          className='text-white text-sm font-medium py-1.5 px-4 border border-[#2B303B] rounded-lg cursor-pointer hover:bg-white/10 transition-colors'
          type="button"
        >
          {profileImage ? 'Change' : 'Upload'}
        </button>
        
        {/* Remove button only when image exists */}
        {profileImage && (
          <button 
            onClick={removeImage}
            className='text-red-400 text-sm font-medium py-1.5 px-4 border border-red-500/50 rounded-lg cursor-pointer hover:bg-red-500/10 transition-colors'
            type="button"
          >
            Remove
          </button>
        )}
      </div>
      
      {/* Error message for upload */}
      {uploadError && (
        <p className='text-red-500 text-xs mt-2 ml-14'>{uploadError}</p>
      )}

      <div className='mt-6 p-4 border border-[#323B49] rounded-lg'>
        <div>
          <h3 className='text-lg text-white font-medium'>Personal Information</h3>
          <p className='text-xs text-[#777980] mt-1'>Modify Your Personal Information</p>
          
          {/* first row */}
          <div className='flex items-center gap-5 mt-4'>
            <div className='flex flex-col gap-2 flex-1 relative'>
              <button 
                className='absolute top-11 right-3 cursor-pointer'
                type="button"
              >
                <InputEditIcon/>
              </button>
              <label htmlFor="first-name" className='text-sm text-white'>First Name</label>
              <input 
                type="text" 
                name="first-name" 
                id="first-name" 
                value={formData.firstName}
                onChange={(e) => handleTextInputChange(e, 'firstName')}
                className='py-2.5 px-3 border border-[#2B303B] rounded-lg placeholder:text-white text-white bg-transparent' 
                placeholder='first name' 
              />
            </div>
            <div className='flex flex-col gap-2 flex-1 relative'>
              <button 
                className='absolute top-11 right-3 cursor-pointer'
                type="button"
              >
                <InputEditIcon/>
              </button>
              <label htmlFor="last-name" className='text-sm text-white'>Last Name</label>
              <input 
                type="text" 
                name="last-name" 
                id="last-name" 
                value={formData.lastName}
                onChange={(e) => handleTextInputChange(e, 'lastName')}
                className='py-2.5 px-3 border border-[#2B303B] rounded-lg placeholder:text-white text-white bg-transparent' 
                placeholder='last name' 
              />
            </div>
          </div>  
          
          {/* second row */}
          <div className='flex items-center gap-5 mt-4'>
            <div className='flex flex-col gap-2 flex-1 relative'>
              <button 
                className='absolute top-11 right-3 cursor-pointer'
                type="button"
              >
                <InputEditIcon/>
              </button>
              <label htmlFor="phone-number" className='text-sm text-white'>Phone Number</label>
              <input 
                type="text" 
                name="phone-number" 
                id="phone-number" 
                value={formData.phoneNumber}
                onChange={(e) => handleTextInputChange(e, 'phoneNumber')}
                className='py-2.5 px-3 border border-[#2B303B] rounded-lg placeholder:text-white text-white bg-transparent' 
                placeholder='phone number' 
              />
            </div>
            <div className='flex flex-col gap-2 flex-1 relative'>
              <button 
                className='absolute top-11 right-3 cursor-pointer'
                type="button"
              >
                <InputEditIcon/>
              </button>
              <label htmlFor="email" className='text-sm text-white'>Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email}
                onChange={(e) => handleTextInputChange(e, 'email')}
                className='py-2.5 px-3 border border-[#2B303B] rounded-lg placeholder:text-white text-white bg-transparent' 
                placeholder='email' 
              />
            </div>
          </div>  
          
          {/* third row - dropdowns */}
          <div className='flex items-center gap-5 mt-4'>
            {/* Country/Region Dropdown */}
            <div className='flex flex-col gap-2 flex-1'>
              <label htmlFor="country" className='text-sm text-white'>Country/Region</label>
              <CustomDropdown
                options={countryOptions}
                value={formData.country}
                onChange={(value: string) => handleInputChange('country', value)}
                placeholder="United States"
                className="w-full"
              />
            </div>
            
            {/* State Dropdown */}
            <div className='flex flex-col gap-2 flex-1'>
              <label htmlFor="state" className='text-sm text-white'>State</label>
              <CustomDropdown
                options={stateOptions}
                value={formData.state}
                onChange={(value: string) => handleInputChange('state', value)}
                placeholder="Select a state"
                className="w-full"
              />
            </div>
          </div>  

          {/* Action Buttons on Left Side - NO TOP BORDER */}
          <div className='flex justify-start gap-3 mt-8'>

             <button
              type="button"
              onClick={handleSave}
              className='px-6 py-2.5 bg-[#00F474] text-[#0E121B] rounded-lg text-sm font-medium 
                       hover:bg-[#00F474]/90 transition-colors active:scale-95'
            >
              Save 
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className='px-6 py-2.5 border border-[#323B49] rounded-lg text-white text-sm 
                       font-medium hover:bg-white/10 transition-colors active:scale-95'
            >
              Cancel
            </button>
            
           
          </div>
        </div>
      </div>
    </div>
  )
}
