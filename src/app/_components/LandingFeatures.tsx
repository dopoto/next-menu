import { BarChart2, Clock, Zap, Users, Globe } from "lucide-react";

export interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
  }
  
export const LandingFeatures: React.FC = () => {
    const features: Feature[] = [
      {
        title: "Advanced Analytics",
        description:
          "Gain deeper insights with our powerful analytics dashboard. Track performance and make data-driven decisions.",
        icon: <BarChart2 className="h-6 w-6 text-indigo-500" />,
      },
      {
        title: "Enterprise Security",
        description:
          "Your data security is our priority. Benefit from best-in-class encryption and secure authentication.",
        icon: <Clock className="h-6 w-6 text-indigo-500" />,
      },
      {
        title: "Lightning Performance",
        description:
          "Optimized for speed, our platform delivers results instantly, saving you valuable time and resources.",
        icon: <Zap className="h-6 w-6 text-indigo-500" />,
      },
      {
        title: "Time-Saving Automation",
        description:
          "Automate repetitive tasks and workflows to increase efficiency and reduce manual workload.",
        icon: <Clock className="h-6 w-6 text-indigo-500" />,
      },
      {
        title: "Team Collaboration",
        description:
          "Foster collaboration with tools designed for effective team communication and project management.",
        icon: <Users className="h-6 w-6 text-indigo-500" />,
      },
      {
        title: "Global Accessibility",
        description:
          "Access your workspace from anywhere in the world, on any device with internet connection.",
        icon: <Globe className="h-6 w-6 text-indigo-500" />,
      },
    ];
  
    return (
      <div className="bg-background py-16" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="heading-label">
              Features
            </h2>
            <p className="heading-main">
              A better way to work
            </p>
            <p className="heading-secondary">
              Our platform is packed with powerful features to help your team
              succeed.
            </p>
          </div>
  
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative flex flex-col rounded-xl bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-secondary">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium ">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base ">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };