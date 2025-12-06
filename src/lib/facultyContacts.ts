import facultyData from './data/faculty.json'

export interface FacultyContact {
  name: string
  designation: string
  role: string
  email: string
  phone: string
  image: string
  responsibilities: string
}

export const facultyContacts: FacultyContact[] = facultyData as FacultyContact[]

export default facultyContacts
