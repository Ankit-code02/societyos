import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  submitSocietyVerification,
  uploadSocietyVerificationDocument,
} from '../../services/api/societyApi'

type DocumentType =
  | 'SOCIETY_REGISTRATION'
  | 'MANAGEMENT_COMMITTEE'
  | 'AUTHORIZATION_LETTER'
  | 'OTHER'

export default function SocietyVerificationPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { societyId, verificationId } = location.state || {}

  const [documentType, setDocumentType] =
    useState<DocumentType>('SOCIETY_REGISTRATION')

  const [document, setDocument] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!societyId || !verificationId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--color-ivory-100)] px-5">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[var(--color-ink-950)]">
            Verification session not found
          </h1>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            Please start the society registration process again.
          </p>

          <button
            type="button"
            onClick={() => navigate('/onboarding/society')}
            className="mt-6 rounded-lg bg-[var(--color-forest-900)] px-5 py-3 font-semibold text-white"
          >
            Register Society
          </button>
        </div>
      </main>
    )
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!document) {
      setError('Please select a verification document.')
      return
    }

    setError('')
    setLoading(true)

    try {
      /*
       * The current backend stores verification document metadata.
       * It does not currently provide a file-storage/upload service.
       *
       * For now we use a local storage key based on the selected file.
       */
      const storageKey =
        `society-verification/${societyId}/${Date.now()}-${document.name}`

      await uploadSocietyVerificationDocument(
        societyId,
        {
          documentType,
          fileName: document.name,
          storageKey,
        }
      )

      const verificationResult =
        await submitSocietyVerification(societyId)

      if (verificationResult.status === 'APPROVED') {
        navigate('/account', { replace: true })
        return
      }

      navigate('/onboarding/society/pending', {
        state: {
          societyId,
          verificationId,
        },
      })
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Unable to submit society verification.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-ivory-100)] px-5 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <p className="text-sm font-semibold text-[var(--color-forest-900)]">
            Society onboarding
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--color-ink-950)]">
            Verify your society
          </h1>

          <p className="mt-3 text-[var(--color-ink-500)]">
            Provide a society document so your society can be reviewed.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-ink-950)]">
              Document type
            </label>

            <select
              value={documentType}
              onChange={(event) =>
                setDocumentType(
                  event.target.value as DocumentType
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="SOCIETY_REGISTRATION">
                Society Registration
              </option>

              <option value="MANAGEMENT_COMMITTEE">
                Management Committee
              </option>

              <option value="AUTHORIZATION_LETTER">
                Authorization Letter
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-[var(--color-ink-950)]">
              Document
            </label>

            <input
              type="file"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) =>
                setDocument(
                  event.target.files?.[0] ?? null
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            <p className="mt-2 text-xs text-[var(--color-ink-500)]">
              Accepted formats: PDF, JPG, JPEG and PNG.
            </p>
          </div>

          {document && (
            <div className="mt-5 rounded-lg bg-[var(--color-ivory-100)] p-4 text-sm">
              Selected file:
              <span className="ml-2 font-medium">
                {document.name}
              </span>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[var(--color-forest-900)] px-6 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading
                ? 'Submitting...'
                : 'Submit for verification'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}