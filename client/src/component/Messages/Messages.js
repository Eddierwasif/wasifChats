import React, { useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';
import './Messages.css';

const Messages = React.memo(({ messages, name, unsendMessage, unsendImage }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleUnsendMessage = (index, isImage) => {
    if (isImage) {
      unsendImage(index);
    } else {
      unsendMessage(index);
    }
  };

  const handleDropdownToggle = (index) => {
    setActiveDropdown((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDropdownOptionClick = (index, isImage) => {
    handleUnsendMessage(index, isImage);
    setActiveDropdown(null);
  };

  return (
    <ScrollToBottom className="messages">
      {messages.map((message, index) => (
        <div key={index} className="message-container">
          <div className="message">
            {message.isImage ? (
              <div>
                <img src={message.image} alt={message.user} />
              </div>
            ) : (
              <Message message={message} name={name} />
            )}
          </div>
          {message.user === name && (
            <div className="message-options">
              <button
                className="options-button"
                onClick={() => handleDropdownToggle(index)}
              >
                <span className="dots">&#8942;</span>
              </button>
              <div
                className={`dropdown ${activeDropdown === index ? 'show' : ''}`}
              >
                <button
                  className="dropdown-option unsend-button"
                  onClick={() => handleDropdownOptionClick(index, message.isImage)}
                >
                  UNSEND
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </ScrollToBottom>
  );
});

export default Messages;
