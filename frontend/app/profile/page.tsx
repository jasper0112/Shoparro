'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getUser, isAuthenticated } from '@/lib/auth'
import { getUserById, updateUser } from '@/lib/api'
import type { User } from '@/lib/auth'
import styles from './profile.module.css'

interface ProfileData {
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  postcode: string
  country: string
  businessName: string
  businessLicense: string
  businessDescription: string
}

interface LinkedAccount {
  id: string
  provider: 'Google' | 'Apple' | 'Facebook' | 'Shopify'
  connected: boolean
  connectedAt?: string
}

const DEFAULT_PROFILE: ProfileData = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  postcode: '',
  country: '',
  businessName: '',
  businessLicense: '',
  businessDescription: '',
}

const LINKED_ACCOUNT_OPTIONS: LinkedAccount[] = [
  { id: 'google', provider: 'Google', connected: false },
  { id: 'apple', provider: 'Apple', connected: false },
  { id: 'facebook', provider: 'Facebook', connected: false },
  { id: 'shopify', provider: 'Shopify', connected: false },
]

export default function UserProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [linkedAccounts, setLinkedAccounts] =
    useState<LinkedAccount[]>(LINKED_ACCOUNT_OPTIONS)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [notifications, setNotifications] = useState({
    productUpdates: true,
    orderUpdates: true,
    securityAlerts: true,
    newsletter: false,
  })
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    const authed = isAuthenticated()
    setIsAuthed(authed)
    setAuthChecked(true)
    if (!authed) {
      router.push('/login')
      return
    }

    const loadUserData = async () => {
      const currentUser = getUser()
      if (currentUser && currentUser.id) {
        setCurrentUserId(currentUser.id)
        try {
          // Fetch fresh user data from backend
          const userData = await getUserById(currentUser.id)
          setProfile({
            username: userData.username || '',
            email: userData.email || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            postcode: userData.postcode || '',
            country: userData.country || '',
            businessName: userData.businessName || '',
            businessLicense: userData.businessLicense || '',
            businessDescription: userData.businessDescription || '',
          })
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
          console.error('Error loading user data:', error)
          // Fallback to localStorage data
          if (currentUser) {
            setProfile({
              username: currentUser.username || '',
              email: currentUser.email || '',
              firstName: currentUser.firstName || '',
              lastName: currentUser.lastName || '',
              phone: currentUser.phone || '',
              address: currentUser.address || '',
              city: currentUser.city || '',
              postcode: currentUser.postcode || '',
              country: currentUser.country || '',
              businessName: currentUser.businessName || '',
              businessLicense: currentUser.businessLicense || '',
              businessDescription: currentUser.businessDescription || '',
            })
          }
        }
      }
    }

    loadUserData()
  }, [router])

  const handleProfileChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result as string)
      setStatusMessage('Avatar updated. Remember to save your changes.')
    }
    reader.readAsDataURL(file)
  }

  const toggleAccountConnection = (accountId: string) => {
    setLinkedAccounts((prev) =>
      prev.map((account) => {
        if (account.id !== accountId) {
          return account
        }

        const connected = !account.connected
        return {
          ...account,
          connected,
          connectedAt: connected
            ? new Date().toLocaleString()
            : undefined,
        }
      })
    )
  }

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    if (!currentUserId) {
      setStatusMessage('User ID not found. Please login again.')
      return
    }

    setIsSaving(true)
    setStatusMessage(null)

    try {
      const updateData = {
        username: profile.username,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        postcode: profile.postcode,
        country: profile.country,
        businessName: profile.businessName,
        businessLicense: profile.businessLicense,
        businessDescription: profile.businessDescription,
      }

      const updatedUser = await updateUser(currentUserId, updateData)
      setStatusMessage('Profile changes saved successfully.')
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error: any) {
      console.error('Error saving profile', error)
      setStatusMessage(error.message || 'Something went wrong while saving your profile.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!authChecked) {
    return null
  }

  if (!isAuthed) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>Your profile</h1>
              <p className={styles.subtitle}>
                Manage your personal details, preferences, and connected services.
              </p>
            </div>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving changes...' : 'Save profile'}
            </button>
          </header>

          {statusMessage && (
            <div className={styles.statusCard}>
              <span>{statusMessage}</span>
            </div>
          )}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic information</h2>
            <p className={styles.sectionSubtitle}>
              This information appears on your receipts and account emails.
            </p>

            <div className={styles.card}>
              <div className={styles.avatarBlock}>
                <div className={styles.avatarWrapper}>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile avatar preview"
                      className={styles.avatarImage}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <span role="img" aria-label="user avatar">
                        👤
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    className={styles.avatarButton}
                    onClick={handleAvatarClick}
                  >
                    Change avatar
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className={styles.hiddenInput}
                  />
                </div>
                <span className={styles.avatarHint}>
                  Recommended 512 × 512px. PNG or JPG up to 2MB.
                </span>
              </div>

              <div className={styles.grid}>
                <label className={styles.field}>
                  <span className={styles.label}>Username</span>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                    placeholder="Enter your username"
                    required
                    minLength={3}
                    maxLength={50}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Email address</span>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="name@example.com"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>First name</span>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    placeholder="Enter your first name"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Last name</span>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    placeholder="Enter your last name"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Phone number</span>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="+61 400 000 000"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Address</span>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    placeholder="Street address"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>City</span>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleProfileChange}
                    placeholder="City"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Postcode</span>
                  <input
                    type="text"
                    name="postcode"
                    value={profile.postcode}
                    onChange={handleProfileChange}
                    placeholder="Postcode"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Country</span>
                  <input
                    type="text"
                    name="country"
                    value={profile.country}
                    onChange={handleProfileChange}
                    placeholder="Country"
                  />
                </label>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional details</h2>
            <p className={styles.sectionSubtitle}>
              Share a few details to personalize your Southside Cart experience.
            </p>

            <div className={styles.card}>
              <div className={styles.grid}>
                <label className={styles.field}>
                  <span className={styles.label}>Business name</span>
                  <input
                    type="text"
                    name="businessName"
                    value={profile.businessName}
                    onChange={handleProfileChange}
                    placeholder="Your business or store name"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Business license</span>
                  <input
                    type="text"
                    name="businessLicense"
                    value={profile.businessLicense}
                    onChange={handleProfileChange}
                    placeholder="ABN or business license number"
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>Business description</span>
                <textarea
                  name="businessDescription"
                  value={profile.businessDescription}
                  onChange={handleProfileChange}
                  placeholder="Describe your business"
                  rows={4}
                />
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Linked accounts</h2>
            <p className={styles.sectionSubtitle}>
              Securely connect third-party services to streamline sign-in, fulfillment, and marketing.
            </p>

            <div className={styles.card}>
              <ul className={styles.accountsList}>
                {linkedAccounts.map((account) => (
                  <li key={account.id} className={styles.accountRow}>
                    <div>
                      <span className={styles.accountProvider}>{account.provider}</span>
                      {account.connected ? (
                        <span className={styles.accountStatus}>
                          Connected on {account.connectedAt}
                        </span>
                      ) : (
                        <span className={styles.accountStatusMuted}>
                          Not connected
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`${styles.accountButton} ${
                        account.connected ? styles.accountDisconnect : ''
                      }`}
                      onClick={() => toggleAccountConnection(account.id)}
                    >
                      {account.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Notifications</h2>
            <p className={styles.sectionSubtitle}>
              Decide which updates you would like to receive from Southside Cart.
            </p>

            <div className={styles.card}>
              <div className={styles.toggleRow}>
                <div>
                  <span className={styles.toggleTitle}>Product updates</span>
                  <p className={styles.toggleDescription}>
                    Alerts for new arrivals, restocks, and curated collections.
                  </p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifications.productUpdates}
                    onChange={() => handleNotificationToggle('productUpdates')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <span className={styles.toggleTitle}>Order updates</span>
                  <p className={styles.toggleDescription}>
                    Shipping confirmations and delivery tracking notifications.
                  </p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifications.orderUpdates}
                    onChange={() => handleNotificationToggle('orderUpdates')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <span className={styles.toggleTitle}>Security alerts</span>
                  <p className={styles.toggleDescription}>
                    Important notices about password changes and new logins.
                  </p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifications.securityAlerts}
                    onChange={() => handleNotificationToggle('securityAlerts')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <span className={styles.toggleTitle}>Newsletter</span>
                  <p className={styles.toggleDescription}>
                    Monthly digest with featured brands, editor picks, and insider tips.
                  </p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifications.newsletter}
                    onChange={() => handleNotificationToggle('newsletter')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Security</h2>
            <p className={styles.sectionSubtitle}>
              Protect your account with multifactor authentication and regular password updates.
            </p>

            <div className={styles.card}>
              <div className={styles.securityGrid}>
                <article className={styles.securityCard}>
                  <h3>Password</h3>
                  <p>Last updated 90 days ago. We recommend changing it regularly.</p>
                  <button type="button" className={styles.secondaryButton}>
                    Update password
                  </button>
                </article>

                <article className={styles.securityCard}>
                  <h3>Two-factor authentication</h3>
                  <p>
                    Add an extra layer of protection with SMS codes or an authenticator app.
                  </p>
                  <button type="button" className={styles.primaryOutlineButton}>
                    Enable two-factor
                  </button>
                </article>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

