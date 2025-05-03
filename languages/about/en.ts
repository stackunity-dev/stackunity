export default {
  meta: {
    title: 'About Us & Contact - StackUnity',
    description: 'Learn more about StackUnity and get in touch with our team for any inquiries or support.',
    keywords: 'StackUnity, about, contact, mission, values, web development, team, support, developers, accessibility',
    author: 'StackUnity'
  },
  nav: {
    backToHome: 'Back to Home'
  },
  about: {
    title: 'About StackUnity',
    subtitle: 'Your all-in-one development toolkit',
    mission: {
      title: 'Our Mission',
      content: 'At StackUnity, our mission is to empower developers by providing them with the tools they need to create exceptional web applications, while reducing complexity and development time. We believe that web development should be accessible to everyone, from beginners to experts, and that the right tools can make all the difference in the quality and efficiency of a developer\'s work.'
    },
    quote: {
      content: "Our vision is to create an ecosystem where every developer can easily transform their ideas into functional, beautiful, and high-performing web applications, without having to master a multitude of different tools.",
      author: "Nûr Djedidi, Founder"
    },
    team: {
      title: 'Our Team',
      content: 'We are a passionate team of developers, designers, and tech enthusiasts committed to creating intuitive and effective solutions for the development community. Our diverse backgrounds and expertise enable us to understand the challenges faced by modern developers.'
    },
    values: {
      title: 'Our Values',
      items: [
        {
          title: 'Innovation',
          content: 'We are constantly looking for new ways to improve our platform and offer more value to our users.',
          icon: 'mdi-lightbulb-on',
          color: 'info'
        },
        {
          title: 'Simplicity',
          content: 'We believe that the best tools are those that are easy to use, while being powerful and flexible.',
          icon: 'mdi-leaf',
          color: 'success'
        },
        {
          title: 'Excellence',
          content: 'We strive to provide tools of the highest quality, reliable and performant for our users.',
          icon: 'mdi-trophy',
          color: 'warning'
        },
        {
          title: 'Community',
          content: 'We value collaboration and mutual support within our developer community.',
          icon: 'mdi-account-group',
          color: 'primary'
        }
      ]
    },
    getInTouch: {
      title: 'Get in Touch',
      content: 'Have questions about StackUnity or want to learn more about our company? Don\'t hesitate to reach out to us.',
      button: 'Contact Us'
    }
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will get back to you as soon as possible.',
    form: {
      name: 'Your name',
      email: 'Your email',
      subject: 'Subject',
      subjects: {
        general: 'General Question',
        technical: 'Technical Support',
        feature: 'Feature Request',
        bug: 'Bug Report',
        partnership: 'Partnership',
        other: 'Other'
      },
      message: 'Your message',
      submit: 'Send Message',
      sending: 'Sending...',
      successTitle: 'Message Sent!',
      successMessage: 'Your message has been sent successfully! We will respond soon.',
      errorTitle: 'Error',
      errorMessage: 'An error occurred while sending your message. Please try again.',
      required: 'Required field',
      invalidEmail: 'Please enter a valid email address',
      fillAllFields: 'Please fill out all fields.'
    },
    info: {
      title: 'Other Ways to Reach Us',
      email: {
        title: 'Email Us',
        content: 'For general inquiries: hello@stackunity.com',
        support: 'For technical support: support@stackunity.com'
      },
      social: {
        title: 'Social Media',
        content: 'Follow us on social media for updates, tips, and more.'
      },
      office: {
        title: 'Our Office',
        content: 'StackUnity HQ, 123 Tech Avenue, San Francisco, CA 94107'
      }
    },
    faq: {
      title: 'Frequently Asked Questions',
      questions: [
        {
          question: 'What is StackUnity?',
          answer: 'StackUnity is a comprehensive web development toolkit that provides a range of utilities for web developers, including API testing, database design, accessibility validation, and more.'
        },
        {
          question: 'How do I get started with StackUnity?',
          answer: 'Simply create a free account and you can immediately start using our basic tools. For access to premium features, check out our subscription options.'
        },
        {
          question: 'Is there a free plan available?',
          answer: 'Yes, StackUnity offers a free tier that includes core functionality. Premium features are available through our paid subscription plans.'
        },
        {
          question: 'How can I report an issue or suggest a feature?',
          answer: 'You can submit issues or feature requests through our contact form or by emailing support@stackunity.com.'
        }
      ]
    }
  },
  footer: {
    copyright: "All rights reserved."
  }
} 