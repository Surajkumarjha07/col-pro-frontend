import { useState } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { useAppSelector } from "../redux/hooks";

export default function ContactUs() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const user = useAppSelector(state => state.User.user);
    const [loading, setLoading] = useState(false);

    console.log("USER:: ", user)

  const sendEmail = (e: any) => {
    e.preventDefault();

    setLoading(true);

    const templateEmail = {
      from_name: (user as any).name,
      from_email: (user as any).email,
      to_email: "surajkumarjha771@gmail.com",
      subject,
      message,
    };

    console.log("TEMPLATE EMAIL::: ", templateEmail);

    console.log("USER:: ", (user as any)?.email, " ", (user as any).name)

    if (user && message != "" && subject !== "") {
      emailjs
        .send("service_0ymaqhr", "template_nkdtd9i", templateEmail, {
          publicKey: "qOLGOqqRXmOzFgrLz",
        })
        .then(
          () => {
            toast.success("Your query has been sent");
            setSubject("");
            setMessage("");
          },
        )
        .catch(
          (error: any) => {
            console.log("ERROR::::::::::: ", error.message);
            toast.error(error);
          }
        )
        .finally(
          () => {
            setLoading(false)
          }
        )
    } else {
      toast.error("Enter your issues specifically");
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Contact Us
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            We'd love to hear from you. Send us a message and we'll respond
            soon.
          </p>
        </div>

        <form className="space-y-8" onSubmit={sendEmail}>
          <div className="space-y-2">
            <label
              htmlFor="heading"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              id="heading"
              type="text"
              placeholder="Enter subject"
              onChange={e => setSubject(e.target.value)}
              value={subject}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Write your message here..."
              onChange={e => setMessage(e.target.value)}
              value={message}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gray-900 cursor-pointer text-white py-3 rounded-xl font-medium hover:bg-gray-800 active:scale-[0.99] transition duration-200 shadow-md"
            >
            {
              loading ? "Sending..." : "Send Message"
            }
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
