import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SectionTitle from '../components/SectionTitle';
// import { assets } from '../assets/assets';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { BsInstagram, BsFacebook } from 'react-icons/bs';
import { Helmet } from 'react-helmet';
import NadaHelmet from '../components/NadaHelmet';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    try {
      // Here you would typically send the data to your backend
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general',
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen">
      <NadaHelmet
        sections={['Contact']}
        description="Nada art call and send mails and get in touch"
        keywords="contact nada art, art gallery contact, commission art, art inquiries, collaborate with artists, art gallery email, art studio phone, message artists, art consultation, creative collaboration"
      />
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center mb-16"
      >
        <SectionTitle title="Get In Touch" />
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Have questions about my artwork or interested in commissioning a
          piece? I'd love to hear from you. Let's create something beautiful
          together.
        </motion.p>
      </motion.section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid lg:grid-cols-2 gap-12 lg:gap-16"
      >
        {/* Contact Form */}
        <motion.div variants={itemVariants} className="order-2 lg:order-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige">
            <p className="text-2xl  mb-6 font-medium">Send Me a Message</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inquiry Type */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Inquiry Type
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                >
                  <option value="general">General Inquiry</option>
                  <option value="commission">Commission Request</option>
                  <option value="purchase">Purchase Inquiry</option>
                  <option value="exhibition">Exhibition/Collaboration</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                  placeholder="your@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                  placeholder="Brief subject line"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light resize-vertical"
                  placeholder="Tell me about your project, ideas, or questions..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          variants={itemVariants}
          className="order-1 lg:order-2 space-y-8"
        >
          {/* Contact Details */}
          <div className="bg-gradient-to-br from-brand-light/10 to-beige-light rounded-2xl p-8 border border-beige">
            <p className="text-2xl mb-6 font-medium">Let's Connect</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-text">Email</p>
                  <a
                    href="mailto:nada@artgallery.com"
                    className="text-brand hover:text-brand-dark transition-colors"
                  >
                    nada@artgallery.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
                  <FiMapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-text">Studio Location</p>
                  <p className="text-gray-600">
                    Available for commissions worldwide
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 pt-6 border-t border-beige">
              <p className="text-sm font-medium text-text mb-4">
                Follow My Journey
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/nadakh.art/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                >
                  <BsInstagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100092463108581"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                >
                  <BsFacebook className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Commission Info */}
          <div className="bg-beige-light rounded-2xl p-8 border border-beige">
            <p className="text-xl mb-4 font-medium">Commission Information</p>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-medium text-text mb-1">
                  Portrait Commissions
                </p>
                <p>Starting from $500 - Custom portraits in various mediums</p>
              </div>
              <div>
                <p className="font-medium text-text mb-1">Abstract Pieces</p>
                <p>Starting from $300 - Personalized abstract artworks</p>
              </div>
              <div>
                <p className="font-medium text-text mb-1">Timeline</p>
                <p>2-6 weeks depending on complexity and size</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4 italic">
              All prices are estimates. Final pricing depends on size, medium,
              complexity, and timeline.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-16 pt-16 border-t border-beige"
      >
        <p className="text-2xl  text-brand-dark mb-4">
          Ready to Start Your Art Journey?
        </p>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Whether you're looking for a custom piece or have questions about
          existing works, I'm here to help bring your vision to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/gallery"
            className="px-6 py-3 bg-beige-dark text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200 font-medium"
          >
            Browse Gallery
          </a>
          <a
            href="https://www.instagram.com/nadakh.art/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border-2 border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-colors duration-200 font-medium"
          >
            See Latest Work
          </a>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;
