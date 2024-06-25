import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    starbucks,
    tesla,
    carrent,
    threejs,
    angular,
    aws,
    express,
    graphql,
    nest,
    remix,
    terraform,
  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Frontend Developer",
      icon: web,
    },
    {
      title: "React Native Developer",
      icon: mobile,
    },
    {
      title: "Backend Developer",
      icon: backend,
    },
    {
      title: "Software Engineer",
      icon: creator,
    },
  ];
  
  const technologies = [
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "TypeScript",
      icon: typescript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Redux Toolkit",
      icon: redux,
    },
    {
      name: "Tailwind CSS",
      icon: tailwind,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "docker",
      icon: docker,
    },
    
    {
      name: "Angular",
      icon: angular,
    },
    
    
    {
      name: "Express",
      icon: express,
    },
    
    {
      name: "GraphQl",
      icon: graphql,
    },
    
    {
      name: "Nest JS",
      icon: nest,
    },
    
    {
      name: "Remix Run",
      icon: remix,
    },
    
    {
      name: "Terraform",
      icon: terraform,
    },
  ];
  
  const experiences = [
    {
      title: "Web Developer",
      company_name: "Adslive Media Corp.",
      icon: starbucks,
      iconBg: "#383E56",
      date: "March 2021 - May 2023",
      points: [
        "Created websites as a fullstack engineer using web technologies such as React.js, Vue.js, and Node.js (with the Express Framework).",
        "Managed the AWS console as an admin to deploy, monitor, and create services.",
        "Utilized web technologies to create Web Augmented Reality with frameworks such as A-Frame and Three.js.",
      ]
    },
    {
      title: "Software Engineer",
      company_name: "Holland Orchids",
      icon: tesla,
      iconBg: "#E6DEDD",
      date: "May 2023 - Jun 2024",
      points: [
        "Maintained and cleaned old systems made on React, Node, and React Native, as well as on-premises servers.",
        "Developed new systems using Remix.js for the frontend, Nest.js and GraphQL for the backend, React Native for mobile, and PostgreSQL for the database.",
        "Designed and Implemented an Inventory and Orders Systems",
        "Designed the next steps to include predictions for Orchids stock",
      ],
    },
  ];
  
  const testimonials = [
    {
      testimonial:
        "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
      name: "Emmanuel Alvarado",
      designation: "ITS DevOps Engineer",
      company: "Allied Global Technology Services",
      image: "https://media.licdn.com/dms/image/D4E03AQE7g-X3TFP0fw/profile-displayphoto-shrink_800_800/0/1671477031793?e=1724889600&v=beta&t=Qs_WII6ve_bqU1M-SkcpvljW8EmWWp9lD8dhgjQu6tw",
    },
    {
      testimonial:
        "He proved to be an honest, respectful, responsible, and hardworking individual. Under my supervision, he worked as a programmer for a custom-made application and website system.",
      name: "Lisa Gonzáles Solé",
      designation: "Marketing and sales manager",
      company: "Holland Orchids",
      image: "https://media.licdn.com/dms/image/D4E03AQHd7_l9-Z2Dgg/profile-displayphoto-shrink_200_200/0/1678215473375?e=2147483647&v=beta&t=DXAWM02sJEsLixe8pgY5SryKju7suCm-_hN6QgJx_aY",
    },
  ];
  
  const projects = 
  [
    {
      name: "Car Rent",
      description:
        "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "mongodb",
          color: "green-text-gradient",
        },
        {
          name: "tailwind",
          color: "pink-text-gradient",
        },
      ],
      image: carrent,
    }
  ];
  
  export { services, technologies, experiences, testimonials, projects };