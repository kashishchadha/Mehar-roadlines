import { useState } from 'react'

function Quote() {
  const [loading, setLoading] = useState(false)
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

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    onClose: null
  })

  const showModal = (title, message, type = 'success', onClose = null) => {
    setModal({ isOpen: true, title, message, type, onClose })
  }

  const closeModal = () => {
    const callback = modal.onClose
    setModal({ ...modal, isOpen: false })
    if (callback) callback()
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

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

      showModal(
        'Quote Request Sent',
        'Thank you! Your shipping volume details have been logged. Our logistics operations team will contact you shortly.',
        'success',
        () => {
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
        }
      )
    } catch (err) {
      showModal('Submission Error', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative z-10 py-16 bg-surface">
      <div className="max-w-[700px] mx-auto px-5">
        
        {/* Header */}
        <header className="text-center mb-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Request a Freight Quote</h1>
          <p className="text-sm text-on-surface-muted max-w-lg mx-auto">
            Provide your monthly volume and cargo metrics. Get customized enterprise rates for B2B transport.
          </p>
        </header>

        {/* Form Card */}
        <div className="bg-white border border-outline-light rounded-xl p-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Name and Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-muted uppercase tracking-wider">Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  required
                  className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-muted uppercase tracking-wider">Company's Name*</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enterprise Name"
                  required
                  className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                />
              </div>
            </div>

            {/* Row 2: Email and Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-muted uppercase tracking-wider">E-mail ID*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-muted uppercase tracking-wider">Mobile No.*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98765 43210"
                  required
                  className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                />
              </div>
            </div>

            {/* Monthly Volume Selection toggler */}
            <div className="border-t border-b border-outline-faint py-4 space-y-3">
              <label className="text-xs font-bold text-on-surface-muted uppercase tracking-wider block">Avg. Monthly Volume* :</label>
              
              <div className="flex gap-4">
                {['Packages', 'Weight'].map((type) => (
                  <label key={type} className="inline-flex items-center gap-2 cursor-pointer font-semibold text-sm text-primary">
                    <input
                      type="radio"
                      name="volumeType"
                      value={type}
                      checked={formData.volumeType === type}
                      onChange={handleChange}
                      className="w-4 h-4 text-secondary border-outline-light focus:ring-secondary focus:ring-1"
                    />
                    {type}
                  </label>
                ))}
              </div>

              {/* Conditional Volume Fields */}
              <div className="pt-2">
                {formData.volumeType === 'Packages' ? (
                  <div className="flex flex-col gap-2 animate-fade-in">
                    <label className="text-xs font-bold text-on-surface-muted uppercase tracking-wider">Package Qty*</label>
                    <input
                      type="number"
                      name="packageQty"
                      value={formData.packageQty}
                      onChange={handleChange}
                      placeholder="Average total packages per month"
                      required={formData.volumeType === 'Packages'}
                      min="1"
                      className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 animate-fade-in">
                    <label className="text-xs font-bold text-on-surface-muted uppercase tracking-wider">Weight in KGs*</label>
                    <input
                      type="number"
                      name="weightInKgs"
                      value={formData.weightInKgs}
                      onChange={handleChange}
                      placeholder="Average total kilograms per month"
                      required={formData.volumeType === 'Weight'}
                      min="1"
                      className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface-muted uppercase tracking-wider">Message*</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Details of cargo types, corridors required, or specific transport timelines..."
                required
                rows="4"
                className="p-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-secondary text-white text-sm font-bold rounded hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-75 cursor-pointer mt-4"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
              ) : (
                'Submit Quote Request'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Custom Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-outline-light rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 space-y-4 scale-up-100 transition-all text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {modal.type === 'success' && (
                <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
              )}
              {modal.type === 'error' && (
                <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
              )}
              {modal.type === 'info' && (
                <span className="material-symbols-outlined text-secondary text-3xl">info</span>
              )}
              <h3 className="text-lg font-bold text-primary">{modal.title}</h3>
            </div>
            
            <p className="text-sm text-on-surface-muted leading-relaxed">
              {modal.message}
            </p>
            
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 bg-secondary text-white text-xs font-bold rounded hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Quote
