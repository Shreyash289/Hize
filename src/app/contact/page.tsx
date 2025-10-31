"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import { Mail, Phone } from "lucide-react"
import facultyContacts from "@/lib/facultyContacts"

const coordinators = [
  {
    name: "Dr. Godfrey Winster S",
    role: "SPOC — Associate Professor, SRMIST",
    email: "godfreys@srmist.edu.in",
    phone: "9962594141"
  },
  {
    name: "Dr. K. Vijaya",
    role: "Coordinator — Professor — Program Schedule, Inauguration, Valedictory",
    email: "vijayak@srmist.edu.in",
    phone: "9444146212"
  },
  {
    name: "Dr. M. Baskar",
    role: "Coordinator — Associate Professor — Finance, Sponsor, Purchase",
    email: "baskarm1@srmist.edu.in",
    phone: "8248485987"
  },
  {
    name: "Dr. N. Arunachalam",
    role: "Coordinator — Associate Professor — Guest Hospitality and Logistics",
    email: "arunachn@srmist.edu.in",
    phone: "9944342292"
  },
  {
    name: "Dr. J. Selvin Paul Peter",
    role: "Coordinator — Associate Professor — Students Hospitality",
    email: "selvinpj@srmist.edu.in",
    phone: "9986563360"
  },
  {
    name: "Dr. K. Kishore Anthuvan Sahayaraj",
    role: "Coordinator — Assistant Professor — Design of Brochure, Publicity, All campus advertising Board, Certificate and Printing",
    email: "kishorea1@srmist.edu.in",
    phone: "9043103219"
  },
  {
    name: "Dr. S. Gnanavel",
    role: "Co-Coordinator — Associate Professor — Hall arrangement and venue coordination",
    email: "gnanaves1@srmist.edu.in",
    phone: "9976985204"
  },
  {
    name: "Dr. M. Sindhuja",
    role: "Co-Coordinator — Assistant Professor — Report preparation, Photography, IEEE events video for Inaugural function, video for valedictory",
    email: "sindhujm1@srmist.edu.in",
    phone: "9840297677"
  },
  {
    name: "Dr. S. S. Saranya",
    role: "Co-Coordinator — Assistant Professor — Program Schedule, Inauguration, Valedictory",
    email: "saranyas6@srmist.edu.in",
    phone: "7904942221"
  },
  {
    name: "Dr. V. Arulalan",
    role: "Co-Coordinator — Assistant Professor — Guest Memento, participants kit purchase",
    email: "arulalav@srmist.edu.in",
    phone: "8015648194"
  },
  {
    name: "Dr. T. Ragunthar",
    role: "Co-Coordinator — Assistant Professor — Website Design, Development and Updating at regular interval",
    email: "raguntht@srmist.edu.in",
    phone: "9600191718"
  },
  {
    name: "Dr. C. Muralidharan",
    role: "Co-Coordinator — Assistant Professor — Guest Coordination",
    email: "muralidc@srmist.edu.in",
    phone: "9585579526"
  },
  {
    name: "Dr. G. Balamurugan",
    role: "Co-Coordinator — Assistant Professor — Website Design, Development and Updating at regular interval",
    email: "balamurg1@srmist.edu.in",
    phone: "9629308990"
  },
  {
    name: "Dr. K. Vijiyakumar",
    role: "Co-Coordinator — Assistant Professor — Guest Hospitality and Logistics",
    email: "vijiyakk@srmist.edu.in",
    phone: "9994472250"
  },
  {
    name: "Dr. D. Gokulakrishnan",
    role: "Co-Coordinator — Assistant Professor — Participants Registration and accommodation",
    email: "gokulakd@srmist.edu.in",
    phone: "9629879934"
  },
  {
    name: "Dr. Ramkumar Jayaraman",
    role: "Co-Coordinator — Assistant Professor — Participants Registration and accommodation",
    email: "ramkumaj@srmist.edu.in",
    phone: "9894425770"
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">CONTACT</h1>
          <p className="text-xl text-muted-foreground font-serif max-w-2xl">
            Reach our faculty coordinators for HIZE 2026.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coordinators.map((coordinator, index) => (
            <motion.div
              key={coordinator.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="clay-card p-8 space-y-6 bg-gradient-to-br from-card via-secondary to-accent"
            >
              <div>
                <h3 className="text-2xl font-bold mb-2">{coordinator.name}</h3>
                <p className="text-muted-foreground font-serif">{coordinator.role}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <motion.a
                  href={`mailto:${coordinator.email}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 clay-button bg-secondary hover:bg-accent p-4 rounded-xl group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono break-all">{coordinator.email}</span>
                </motion.a>

                <motion.a
                  href={`tel:${coordinator.phone.replace(/\s/g, '')}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 clay-button bg-secondary hover:bg-accent p-4 rounded-xl group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono">{coordinator.phone}</span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Faculty Team section (added from provided list) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mt-16 mb-8"
        >
          <h2 className="text-4xl font-semibold tracking-tight">FACULTY TEAM</h2>
          <p className="text-md text-muted-foreground font-serif max-w-2xl">
            Official list of faculty in-charge for HIZE 2026 (as provided).
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facultyContacts.map((f, idx) => (
            <motion.div
              key={f.name + idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="clay-card p-8 space-y-6 bg-gradient-to-br from-card via-secondary to-accent"
            >
              <div>
                <h3 className="text-2xl font-bold mb-2">{f.name}</h3>
                <p className="text-muted-foreground font-serif">{f.designation}</p>
                {f.role ? <p className="text-sm text-muted-foreground mt-1">{f.role}</p> : null}
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                {f.email ? (
                  <motion.a
                    href={`mailto:${f.email}`}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 clay-button bg-secondary hover:bg-accent p-4 rounded-xl group transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-mono break-all">{f.email}</span>
                  </motion.a>
                ) : null}

                {f.phone ? (
                  <motion.a
                    href={`tel:${f.phone.replace(/\s/g, '')}`}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 clay-button bg-secondary hover:bg-accent p-4 rounded-xl group transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-mono">{f.phone}</span>
                  </motion.a>
                ) : null}

                {f.responsibilities ? (
                  <p className="text-sm text-muted-foreground">{f.responsibilities}</p>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 IEEE CS SRM | In collaboration with SRM Institute of Science & Technology</p>
        </div>
      </footer>
    </div>
  )
}