import type { ReactNode } from "react";

export function BoxWarning(props: { title: string; ctas?: ReactNode[]; }) {
  return (
    <div className="shadow" role="alert">
      <div className="flex">
        <div className="w-16 bg-orange-500 p-2 text-center">
          <div className="flex h-full items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>
        <div className="w-full border-r-4 border-orange-400 bg-white p-4">
          <div>
            <p className="font-bold text-gray-600">{props.title}</p>
            <p className="text-sm text-gray-600">
              Your message has been send to Jack
            </p>
            {props.ctas && (
              <div className="mt-2 flex space-x-2 pt-4">
                {props.ctas?.map((cta, index) => <div key={index}>{cta}</div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
