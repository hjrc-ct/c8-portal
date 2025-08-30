# c8-portal: Educational Course Website

Welcome to the Camunda 8 Self Managged - Deployment on GKE project! This project is designed to provide an interactive learning experience through a structured course divided into four parts.

## Project Structure

The project is organized as follows:

```
c8-portal
├── src
│   ├── index.html          # Main entry point for the website
│   ├── styles              # Contains CSS files
│   │   └── main.css        # Main stylesheet for the website
│   ├── scripts             # Contains JavaScript files
│   │   └── app.js          # Main JavaScript file for interactivity
│   ├── components          # Contains reusable components
│   │   ├── Header.js       # Header component
│   │   ├── Footer.js       # Footer component
│   │   └── CoursePart.js    # Course part component
│   └── pages               # Contains HTML files for each course part
│       ├── Part1.html      # Content for Part 1 of the course
│       ├── Part2.html      # Content for Part 2 of the course
│       ├── Part3.html      # Content for Part 3 of the course
│       └── Part4.html      # Content for Part 4 of the course
├── package.json            # npm configuration file
├── README.md               # Project documentation
└── .gitignore              # Files and directories to ignore in version control
```

## Getting Started

To get started with the Educational Course Website, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd educational-course-website
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the website**:
   Open `src/index.html` in your web browser to view the website.

## Features

- Structured course divided into four parts.
- Responsive design with a clean layout.
- Interactive elements powered by JavaScript.
- Reusable components for the header, footer, and course parts.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.