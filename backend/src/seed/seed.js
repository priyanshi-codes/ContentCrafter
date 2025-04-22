import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constant.js";
import { Genre } from "../models/genre.model.js";
import { Content } from "../models/content.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Utility function to avoid duplicate genres
const findOrCreateGenre = async (name, description) => {
  let genre = await Genre.findOne({ name });
  if (!genre) {
    genre = await Genre.create({ name, description });
  }
  return genre;
};

const seed = async () => {
  try {
    await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log("MongoDB connected");

    // Find or create genres
    const genre1 = await findOrCreateGenre(
      "Technology",
      "All about tech innovations and coding."
    );
    const genre2 = await findOrCreateGenre(
      "Health",
      "Health tips and fitness articles."
    );
    const genre3 = await findOrCreateGenre(
      "Finance",
      "Investment trends, fintech updates, and economic news."
    );
    const genre4 = await findOrCreateGenre(
      "Education",
      "Modern learning techniques and education technologies."
    );
    const genre5 = await findOrCreateGenre(
      "Lifestyle",
      "Trendy and mindful ways of modern living."
    );
    const genre6 = await findOrCreateGenre(
      "Travel",
      "Destinations, remote work spots, and travel guides."
    );
    const genre7 = await findOrCreateGenre(
      "Environment",
      "Sustainability, climate, and eco-innovation."
    );
    const genre8 = await findOrCreateGenre(
      "Entertainment",
      "Movies, music, pop culture, and digital content."
    );

    // Optional: Remove old content if needed before inserting new
    await Content.deleteMany({}); // Only use if you want a fresh start every time

    // Insert content
    await Content.create([

         {
        genre: genre1._id,
        title: "The Rise of Generative AI",
        content: `Generative AI tools like ChatGPT and Midjourney are redefining creativity and productivity. From content creation to software development, the applications are vast.`
    },
    {
        genre: genre1._id,
        title: "Edge Computing in 2025",
        content: `Edge computing reduces latency by processing data closer to the source. It plays a pivotal role in IoT and real-time decision-making.`
    },
    {
        genre: genre1._id,
        title: "The Role of 5G in Smart Cities",
        content: `5G technology enables smart infrastructure, autonomous vehicles, and seamless connectivity in modern urban environments.`
    },
    {
        genre: genre1._id,
        title: "Quantum Computing Basics",
        content: `Quantum computing uses qubits instead of bits to solve problems beyond the capability of classical computers.`
    },
    {
        genre: genre1._id,
        title: "Cybersecurity Trends to Watch",
        content: `With the rise of remote work and data breaches, Zero Trust Architecture and AI-driven threat detection are trending in 2025.`
    },

    // Health
    {
        genre: genre2._id,
        title: "The Science of Intermittent Fasting",
        content: `Intermittent fasting is more than a trend—it's a metabolic approach that supports weight management and longevity.`
    },
    {
        genre: genre2._id,
        title: "Mental Health in the Digital Age",
        content: `Digital detoxes, mindfulness apps, and mental health awareness are reshaping how we care for our minds.`
    },
    {
        genre: genre2._id,
        title: "Wearable Tech in Healthcare",
        content: `Smartwatches now monitor heart rate, sleep, and even detect falls, helping people manage health in real-time.`
    },
    {
        genre: genre2._id,
        title: "The Gut-Brain Connection",
        content: `Gut health impacts mental well-being, with probiotics and healthy diets becoming essential for brain function.`
    },
    {
        genre: genre2._id,
        title: "AI-Powered Diagnostics",
        content: `AI is transforming diagnostics by analyzing medical images and patient data with higher accuracy and speed.`
    },

      {
        genre: genre3._id,
        title: "AI Integration in Education: Transforming Learning Experiences",
        content: `The integration of Artificial Intelligence (AI) into education systems is revolutionizing the way students learn and educators teach. Adaptive learning platforms, such as MathsWatch and Johnnie Max, utilize AI to tailor lessons to individual student needs, enhancing engagement and academic outcomes. The global AI in education market is projected to grow from $4 billion in 2022 to $20 billion by 2027, reflecting a significant shift towards personalized learning experiences.
              
              In China, the Ministry of Education has announced a comprehensive reform to integrate AI across all levels of education, aiming to develop essential skills among teachers and students, including independent thinking and problem-solving. This initiative is part of China's broader strategy to enhance innovation and sustain economic growth`,
      },
      {
        genre: genre3._id,
        title: "Competency-Based Learning: Shaping Future-Ready Students",
        content: `Competency-Based Learning (CBL) is reshaping the educational landscape by focusing on students' mastery of specific skills and competencies rather than time spent in class. This approach allows learners to progress at their own pace, ensuring a deeper understanding of the subject matter.`,
      },
      {
        genre: genre4._id,
        title: "Green Careers: The Rise of Sustainability in the Workforce",
        content: `The global shift towards sustainability is not only transforming industries but also reshaping the job market. Companies are increasingly embedding green practices into their core business strategies to meet consumer and regulatory demands. This transition has led to the emergence of new roles such as sustainable materials officers and circular economy consultants, reflecting the growing prioritization of Environmental, Social, and Governance (ESG) values.
                  
                  In the UK, the green job sector is expanding rapidly, with nearly one million individuals employed in sustainability-related roles. These positions are not only contributing to environmental conservation but also offering higher pay—approximately 18% more than comparable roles—and increased purpose alignment, particularly among Gen Z and Gen Alpha workers`,
      },
        {
          genre: genre3._id,
          title: "AI Integration in Education: Transforming Learning Experiences",
          content: `The integration of Artificial Intelligence (AI) into education systems is revolutionizing the way students learn and educators teach. Adaptive learning platforms, such as MathsWatch and Johnnie Max, utilize AI to tailor lessons to individual student needs, enhancing engagement and academic outcomes. The global AI in education market is projected to grow from $4 billion in 2022 to $20 billion by 2027, reflecting a significant shift towards personalized learning experiences.
      
      In China, the Ministry of Education has announced a comprehensive reform to integrate AI across all levels of education, aiming to develop essential skills among teachers and students, including independent thinking and problem-solvresThis initiative is part of China's broader strategy to enhance innovation and sustain economic growth.`
        },
        {
          genre: genre3._id,
          title: "Competency-Based Learning: Shaping Future-Ready Students",
          content: `Competency-Based Learning (CBL) is reshaping the educational landscape by focusing on students' mastery of specific skills and competencies rather than time spent in class. This approach allows learners to progress at their own pace, ensuring a deeper understanding of the subject matters`
        },
     
      
      {
        genre: genre4._id,
        title: "Renewable Energy: Powering a Sustainable Future",
        content: `Renewable energy sources, such as solar, wind, and hydroelectric power, are at the forefront of the global effort to combat climate change. The transition to clean energy is essential for reducing greenhouse gas emissions and achieving net-zero targets.
                  The growth of the renewable energy sector is also creating numerous job opportunities. According to the International Renewable Energy Agency (IRENA), the sector employed 12 million people worldwide in 2021, with projections indicating continued growth in the coming years.
                  ::contentReference[oaicite:27]`,
      },
     
        {
          genre: genre4._id,
          title: "Green Careers: The Rise of Sustainability in the Workforce",
          content: `The global shift towards sustainability is not only transforming industries but also reshaping the job market. Companies are increasingly embedding green practices into their core business strategies to meet consumer and regulatory demands. This transition has led to the emergence of new roles such as sustainable materials officers and circular economy consultants, reflecting the growing prioritization of Environmental, Social, and Governance (ESG) values.
      
      In the UK, the green job sector is expanding rapidly, with nearly one million individuals employed in sustainability-related roles. These positions are not only contributing to environmental conservation but also offering higher pay—approximately 18% more than comparable roles—and increased purpose alignment, particularly among Gen Z and Gen Alpha workers.`
        },
        {
          genre: genre4._id,
          title: "Renewable Energy: Powering a Sustainable Future",
          content: `Renewable energy sources, such as solar, wind, and hydroelectric power, are at the forefront of the global effort to combat climate change. The transition to clean energy is essential for reducing greenhouse gas emissions and achieving net-zero targets
      
      The growth of the renewable energy sector is also creating numerous job opportunities. According to the International Renewable Energy Agency (IRENA), the sector employed 12 million people worldwide in 2021, with projections indicating continued growth in the coming years`
        },
          // Lifestyle
    {
        genre: genre5._id,
        title: "Minimalist Living in a Maximalist World",
        content: `Minimalism promotes intentional living by focusing on essentials and reducing mental clutter.`
    },
    {
        genre: genre5._id,
        title: "Digital Declutter: The New Wellness",
        content: `Reducing screen time and organizing digital spaces can significantly improve mental well-being.`
    },
    {
        genre: genre5._id,
        title: "Plant-Based Diets Going Mainstream",
        content: `People are turning to plant-based meals for health benefits, sustainability, and ethical reasons.`
    },
    {
        genre: genre5._id,
        title: "The Rise of Home Wellness Spaces",
        content: `Home gyms, meditation corners, and ergonomic setups are redefining lifestyle trends post-pandemic.`
    },
    {
        genre: genre5._id,
        title: "Sustainable Fashion Choices",
        content: `Consumers now prioritize eco-friendly brands and second-hand shopping over fast fashion.`
    },

    // Travel
    {
        genre: genre6._id,
        title: "Workcations: The Future of Remote Work",
        content: `Blending travel and work is popular among digital nomads, enhancing productivity and lifestyle.`
    },
    {
        genre: genre6._id,
        title: "Hidden Gems: Offbeat Travel Spots",
        content: `Travelers now prefer exploring lesser-known, crowd-free destinations to experience local culture.`
    },
    {
        genre: genre6._id,
        title: "Sustainable Travel Habits",
        content: `Eco-conscious travel includes carbon offsetting, reusable gear, and supporting local communities.`
    },
    {
        genre: genre6._id,
        title: "AI-Powered Trip Planning",
        content: `From smart itineraries to travel risk assessments, AI tools are transforming how we explore the world.`
    },
    {
        genre: genre6._id,
        title: "Culinary Travel: Tasting the World",
        content: `Food tourism is booming, with people exploring cultures through local cuisines and street food.`
    },

    // Environment
    {
        genre: genre7._id,
        title: "Climate Tech Innovations",
        content: `New technologies like carbon capture, plant-based plastics, and climate modeling are shaping our future.`
    },
    {
        genre: genre7._id,
        title: "Urban Gardening for Sustainability",
        content: `Growing vegetables at home and on rooftops is promoting food security and greener cities.`
    },
    {
        genre: genre7._id,
        title: "Plastic Waste Management Solutions",
        content: `Innovative startups are tackling plastic waste with biodegradable alternatives and AI-driven recycling.`
    },
    {
        genre: genre7._id,
        title: "Green Jobs in the New Economy",
        content: `The shift to clean energy and ESG practices is creating demand for sustainability-focused careers.`
    },
    {
        genre: genre7._id,
        title: "Wildlife Conservation in 2025",
        content: `Tech-enabled tracking, anti-poaching drones, and DNA-based protection are helping save endangered species.`
    },

    // Entertainment
    {
        genre: genre8._id,
        title: "The Creator Economy Boom",
        content: `Independent creators are monetizing content on YouTube, TikTok, and Substack, reshaping entertainment.`
    },
    {
        genre: genre8._id,
        title: "AI in Music and Film Production",
        content: `AI-generated music, scripts, and editing tools are transforming creative workflows.`
    },
    {
        genre: genre8._id,
        title: "The Rise of Short-Form Content",
        content: `Reels, Shorts, and TikToks are dominating content consumption with bite-sized storytelling.`
    },
    {
        genre: genre8._id,
        title: "Virtual Concerts and Metaverse Events",
        content: `Artists now host immersive shows in digital universes, offering interactive fan experiences.`
    },
    {
        genre: genre8._id,
        title: "Streaming Wars: What’s Next?",
        content: `Platforms are battling for viewers through exclusive content, bundling, and global expansion strategies.`
    }  
      
    ]);

    console.log("Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error in inserting data: ", error);
    process.exit(1);
  }
};

seed();
