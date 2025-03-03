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
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel sem leo.",
        icon: <BarChart2 className="h-6 w-6 text-pop" />,
      },
      {
        title: "Enterprise Security",
        description:
          "Nunc eget tincidunt libero. Pellentesque fringilla congue nisi id lobortis.",
        icon: <Clock className="h-6 w-6 text-pop" />,
      },
      {
        title: "Lightning Performance",
        description:
          "Mauris turpis lectus, finibus eget gravida a, sollicitudin sit amet risus.",
        icon: <Zap className="h-6 w-6 text-pop" />,
      },
      {
        title: "Time-Saving Automation",
        description:
          "Donec ac lobortis enim, id pellentesque massa. Nulla quis enim ut elit consequat malesuada.",
        icon: <Clock className="h-6 w-6 text-pop" />,
      },
      {
        title: "Team Collaboration",
        description:
          "Quisque tincidunt aliquam malesuada. Maecenas maximus purus ac metus congue viverra. ",
        icon: <Users className="h-6 w-6 text-pop" />,
      },
      {
        title: "Global Accessibility",
        description:
          "Suspendisse tincidunt diam non risus venenatis, ac efficitur velit sodales. Aenean blandit consequat elit in pellentesque.",
        icon: <Globe className="h-6 w-6 text-pop" />,
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