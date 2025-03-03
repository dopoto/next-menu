import { Card } from "~/components/ui/card";

interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    content:
      "TheMenu has transformed how our team works. The intuitive interface and powerful features have boosted our productivity by over 40%.",
    author: "Sarah Johnson",
    role: "CTO",
    company: "TechNova",
  },
  {
    content:
      "We've been using TheMenu for over a year now, and it's been a game-changer for our remote team. The collaboration tools are second to none.",
    author: "Michael Chen",
    role: "Product Manager",
    company: "Flexibyte",
  },
  {
    content:
      "The customer support is exceptional. Any time we've had questions, the team has been responsive and helpful. Highly recommend!",
    author: "Emily Rodriguez",
    role: "Operations Director",
    company: "Greystone Inc",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <div
      className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 py-16"
      id="testimonials"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="heading-label">
            Testimonials
          </h2>
          <p className="heading-main">
            Trusted by businesses worldwide
          </p>
          <p className="heading-secondary">
            {
              "Don't just take our word for it — hear what our customers have to say."
            }
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="flex h-full flex-col rounded-xl bg-card p-6 shadow-sm"
            >
              <div className="flex-grow">
                <p className="text-gray-600 italic">&quot;{testimonial.content}&quot;</p>
              </div>
              <div className="mt-6 flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
