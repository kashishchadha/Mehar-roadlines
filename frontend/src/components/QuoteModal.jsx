import { useState } from 'react'

function QuoteModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    volumeType: 'Packages', // 'Packages' or 'Weight'
    packageQty: '',
    weightInKgs: '',
    message: ''
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Format description text incorporating specific quote metrics
    const compiledMessage = `
--- Business Quote Inquiry ---
Company: ${formData.companyName}
Email: ${formData.email}
Avg. Monthly Volume Type: ${formData.volumeType}
${formData.volumeType === 'Packages' ? `Package Quantity: ${formData.packageQty}` : `Weight in KGs: ${formData.weightInKgs}`}

Message Detail:
${formData.message}
    `.trim()

    try {
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          origin: 'Quote Request',
          destination: formData.companyName,
          message: compiledMessage
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to submit quote request.')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      volumeType: 'Packages',
      packageQty: '',
      weightInKgs: '',
      message: ''
    })
    setSubmitted(false)
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-primary/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white border border-outline-light rounded-2xl w-full max-w-lg shadow-2xl z-10 overflow-hidden transform transition-all duration-300 animate-scale-up my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-muted hover:text-secondary p-1.5 hover:bg-surface-low rounded-full transition-all cursor-pointer z-20"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {submitted ? (
          // Success State
          <div className="p-8 text-center space-y-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce">
              <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-primary">Inquiry Submitted</h3>
              <p className="text-sm text-on-surface-muted max-w-xs mx-auto">
                Thank you! Your shipping volume details have been logged. Our logistics operations team will contact you shortly.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-secondary text-white font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          // Form State
          <div className="flex flex-col max-h-[85vh]">
            <header className="p-6 border-b border-outline-light bg-surface-low pr-14">
              <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">request_quote</span>
                Request a Freight Quote
              </h2>
              <p className="text-xs text-on-surface-muted mt-1">
                Provide shipping metrics to get custom B2B enterprise rates.
              </p>
            </header>

            <div className="flex-grow overflow-y-auto p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="h-10 px-3 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-xs outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">Company's Name*</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Company Name"
                      required
                      className="h-10 px-3 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">E-mail ID*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@company.com"
                      required
                      className="h-10 px-3 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-xs outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">Mobile No.*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      required
                      className="h-10 px-3 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Volume Section */}
                <div className="border-t border-b border-outline-faint py-3 space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider block">Avg. Monthly Volume* :</label>
                  
                  <div className="flex gap-4">
                    {['Packages', 'Weight'].map((type) => (
                      <label key={type} className="inline-flex items-center gap-1.5 cursor-pointer font-semibold text-xs text-primary">
                        <input
                          type="radio"
                          name="volumeType"
                          value={type}
                          checked={formData.volumeType === type}
                          onChange={handleChange}
                          className="w-3.5 h-3.5 text-secondary border-outline-light focus:ring-secondary focus:ring-1"
                        />
                        {type}
                      </label>
                    ))}
                  </div>

                  <div className="pt-1">
                    {formData.volumeType === 'Packages' ? (
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">Package Qty*</label>
                        <input
                          type="number"
                          name="packageQty"
                          value={formData.packageQty}
                          onChange={handleChange}
                          placeholder="Monthly package count"
                          required={formData.volumeType === 'Packages'}
                          min="1"
                          className="h-10 px-3 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-xs outline-none"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">Weight in KGs*</label>
                        <input
                          type="number"
                          name="weightInKgs"
                          value={formData.weightInKgs}
                          onChange={handleChange}
                          placeholder="Monthly cargo weight (KGs)"
                          required={formData.volumeType === 'Weight'}
                          min="1"
                          className="h-10 px-3 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-xs outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">Message*</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Details of cargo types, routes, or specific logistics needs..."
                    required
                    rows="3"
                    className="p-3 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-xs outline-none resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-secondary text-white text-xs font-bold rounded-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-75 cursor-pointer mt-4"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  ) : (
                    'Submit Quote Request'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuoteModal
