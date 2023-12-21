export function generateRandomData(numRows) {
  const data = []

  for (let i = 1; i <= numRows; i++) {
    const children = generateRandomChildren(i)

    const row = {
      id: i,
      lastName: getRandomName(),
      firstName: getRandomName(),
      age: Math.floor(Math.random() * 100) + 1,
      phoneNumber: generateRandomPhoneNumber(),
      email: generateRandomEmail(getRandomName(), getRandomName()),
    }

    if (children.length > 0) {
      row['children'] = children
    }

    data.push(row)
  }

  return data
}

function generateRandomId() {
  return Math.floor(Math.random() * 999999) + 1
}

function generateRandomChildren(check: number) {
  const children = []

  if (check % 2 === 0) return children

  for (let i = 1; i <= 3; i++) {
    const child = {
      id: generateRandomId(),
      lastName: getRandomName(),
      firstName: getRandomName(),
      age: Math.floor(Math.random() * 100) + 1,
      phoneNumber: generateRandomPhoneNumber(),
      email: generateRandomEmail(getRandomName(), getRandomName()),
      children: [
        {
          id: generateRandomId(),
          lastName: getRandomName(),
          firstName: getRandomName(),
          age: Math.floor(Math.random() * 100) + 1,
          phoneNumber: generateRandomPhoneNumber(),
          email: generateRandomEmail(getRandomName(), getRandomName()),
        },
      ],
    }

    children.push(child)
  }

  return children
}

function getRandomName() {
  const names = ['Jon', 'Cersei', 'Jaime', 'Arya', 'Daenerys', 'Melisandre', 'Ferrara', 'Rossini', 'Harvey']
  const randomIndex = Math.floor(Math.random() * names.length)
  return names[randomIndex]
}

function generateRandomPhoneNumber() {
  const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000 // Generates a 10-digit random number
  return `+1-${randomNumber.toString().substring(0, 3)}-${randomNumber.toString().substring(3, 6)}-${randomNumber
    .toString()
    .substring(6)}`
}

function generateRandomEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com']
  const randomDomain = domains[Math.floor(Math.random() * domains.length)]
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomDomain}`
}
