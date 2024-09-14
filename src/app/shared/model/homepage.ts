export const homepageContent = (name: string) => {
  const data: any = {
    default: {
      banner: {
        title: 'Our mission is to empower 1 billion lives through our essential emergency response',
        subtitle: '',
        btnLabel: 'Join us now'
      },
      fundraisers: {
        title: `Make a Difference with ${name}`,
        subtitle: `<div>Contribute to save lives at risk and in need of urgent funds.</div> <div>Help them win their battle for life.</div>`,
      },
      taxBenefitCard: {
        title: 'Contribute and Gain Tax Benefits',
        subtitle: `Every contribution at ${name} comes with tax advantages. Download your 80G/IRS Tax Certificate and save on your taxes.`,
      },
      missionCard: {
        title: 'Building a more just and equitable world',
        subtitle: `${name} (Empowering Quest, Unity, and Life for All) connects people with a passion for helping to nonprofits dedicated to empowering the most vulnerable communities globally`,
      },
      why: [
        {
          title: 'Support global causes with confidence',
          desc: `Every donation you make is backed by our ${name} Guarantee. This means we're committed to ensuring your funds are used effectively and transparently. Our rigorous vetting process, combined with our state-of-the-art security technology, guarantees that only the most reputable and trustworthy organizations receive your support.`,
          image: '/assets/images/why/why-1.png'
        },
        {
          title: 'We Check Everything',
          desc: `${name} is your reliable choice. We carefully vet every campaign, securing your contributions for the intended beneficiaries.`,
          image: '/assets/images/why/why-2.png'
        },
        {
          title: 'Connecting Good Hearts',
          desc: `“Doing good means ${name} to me.” For 11 years, ${name} has been the link between contributors and beneficiaries, making the act of contributing effortless for thousands.`,
          image: '/assets/images/why/why-3.png'
        }
      ],
      howItWorksTitle: 'How it works',
      howItWorks: [
        {
          title: 'Patient Seeks Care',
          desc: 'Rahul is brought to our medical partner.',
          image: '/assets/images/how/how-1.png'
        },
        {
          title: 'Case Approval and Fundraising',
          desc: `Rahul's profile is reviewed and approved, initiating the fundraiser.`,
          image: '/assets/images/how/how-2.png'
        },
        {
          title: 'Care Funding by Contributors',
          desc: `Generous contributors fund Rahul's care.`,
          image: '/assets/images/how/how-3.png'
        },
        {
          title: 'Impact Updates',
          desc: `Receive constant updates on the patient's condition.`,
          image: '/assets/images/how/how-4.png'
        }
      ],
    },
    'Indian Messiah': {
      banner: {
        title: 'Crowdfunding that helps save lives',
        subtitle: '<h2>Not everybody can afford healthcare. Our Zakat donors are changing this.</h2> <h2>Indian Messiah ensures your Zakat reaches those most in need.</h2>',
        btnLabel: 'I Want to Help / Contribute Now'
      },
      fundraisers: {
        title: 'Support Zakat-verified fundraisers today',
        subtitle: 'Contribute to save a life at risk and in urgent need of funds. Help provide medical care',
      },
      taxBenefitCard: {
        title: 'Understanding Zakat',
        subtitle: `Zakat (meaning 'purification' in Arabic) is an obligatory tax on every Muslim designed to help the poor and empower communities. This type of charity is believed to purify your wealth and increase blessings in your life.`,
      },
      missionCard: {
        title: 'Driving change with the power of crowdfunding',
        subtitle: 'We bring people together through our crowdfunding platform to fund life-changing healthcare for people in need',
      },
      why: [
        {
          title: 'We Help Save Lives',
          desc: 'Witness the life-changing impact of 2.9L Indian Messiah supporters, transforming lives with every single contribution',
          image: '/assets/images/why/why-1.png'
        },
        {
          title: 'We Check Everything',
          desc: `Your peace of mind is our priority. That's why we work with 300+ hospitals, to vet fundraisers and ensure your support reaches the right person`,
          image: '/assets/images/why/why-2.png'
        },
        {
          title: 'We Connect People',
          desc: `When I think of doing good, I think of ${name}.” With 11 years behind us, we still strive to connect contributors with people who need help`,
          image: '/assets/images/why/why-3.png'
        }
      ],
      howItWorksTitle: 'Our Approach',
      howItWorks: [
        {
          title: 'Patient Seeks Care',
          desc: 'Diagnosed with a critical condition, Imran is brought to our medical partner',
          image: '/assets/images/how/how-1.png'
        },
        {
          title: 'Case Approval and Fundraising',
          desc: `Imran’s documents and history are reviewed, post which a fundraiser goes live`,
          image: '/assets/images/how/how-2.png'
        },
        {
          title: 'Fundraising Begins ',
          desc: `Generous contributors choose to directly fund Imran’s medical care`,
          image: '/assets/images/how/how-3.png'
        },
        {
          title: 'Updates Shared',
          desc: `Post-treatment updates are shared with every contributor regularly`,
          image: '/assets/images/how/how-4.png'
        }
      ]
    }
  }
  return data.hasOwnProperty(name) ? data[name] : data.default;
}