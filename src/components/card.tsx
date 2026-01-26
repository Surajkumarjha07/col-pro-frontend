import type React from "react"

type cardTYpe = {
    title: string,
    description: React.ReactNode,
    icon: React.ReactNode
}

export default function Card({title, description, icon}: cardTYpe) {
  return (
    <>
        <div className="flex flex-col items-center justify-start gap-12 shadow-lg shadow-gray-300 bg-purple-50 px-6 py-12 rounded-3xl transition-all duration-300 hover:scale-110">
            {
                icon
            }
            <h1 className="text-3xl font-semibold text-gray-900">
                { title }
            </h1>

            <p className="text-gray-600 text-center text-lg font-medium">
                {
                    description
                }
            </p>
        </div>
    </>
  )
}
