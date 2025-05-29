import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FeedbackModal } from '../components/FeedbackModal';
import { MessageModal } from '../components/MessageModal';

const Support = () => {
  const navigate = useNavigate();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#E7E1BC]">
      {/* Header con X */}
      <div className="w-full p-4 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="hover:bg-gray-100"
        >
          <X size={24} />
        </Button>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center px-4 py-8 md:py-16">
        <div className="max-w-2xl w-full text-center space-y-8">

          {/* Logo/Nombre */}
          <img className='mx-auto' src="/CasaSardaColor.png" alt="Logo" />

                    {/* Mensaje principal */}
            <h1 className="text-2xl font-serif font-semibold text-gray-900 leading-relaxed">
                We're glad you're enjoying your new app. If you'd like to add this new feature, please contact the support team.
            </h1>

          <img className='mx-auto' src="/OliveImage.png" alt="OliveImage" />

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button
              onClick={() => setIsFeedbackModalOpen(true)}
              size="lg"
              className="w-full sm:w-auto px-8"
            >
              Add Feedback
            </Button>
            <Button
              onClick={() => setIsMessageModalOpen(true)}
              size="lg"
              className="w-full sm:w-auto px-8"
            >
              Send Message
            </Button>
          </div>

        </div>
      </div>

      {/* Modales */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
      />
    </div>
  );
};

export default Support;