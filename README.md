# 3D Voxel Editor

A browser-based 3D voxel editor built with Python Flask and Three.js. Place and remove cube blocks in a 3D space, similar to Minecraft's building mechanics.

## Features

- Place cube blocks with a left click
- Remove blocks with Shift + Left Click
- Rotate the camera view with Ctrl + Right Click (hold and drag)
- Zoom in/out with the mouse scroll wheel
- Large 1000x1000 grid plane as the base
- Real-time raycasting for precise block placement
- Textured cubes with ambient and directional lighting

## Tech Stack

| Layer    | Technology                   |
|----------|------------------------------|
| Backend  | Python + Flask               |
| Frontend | JavaScript (ES6), HTML5, CSS3|
| 3D Graphics | Three.js v0.173.0 (CDN)  |
| Controls | OrbitControls (Three.js)     |
| Rendering | WebGL                       |

## Project Structure

```
3D-project-/
└── 3D modeling script/
    ├── app.py                  # Flask server
    ├── templates/
    │   └── index.html          # Main HTML entry point
    └── static/
        ├── js/
        │   ├── main.js         # Basic Three.js demo
        │   ├── main2.js        # Voxel editor (active)
        │   └── main3.js        # Alternative implementation
        ├── css/
        │   └── main.css        # UI styles
        ├── models/
        │   └── st5_round_frame.obj
        └── textures/
            ├── img.png
            ├── img_1.png
            └── square-outline-textured.png
```

## Getting Started

### Prerequisites

- Python 3.x
- Flask

Install Flask if you don't have it:

```bash
pip install flask
```

### Run the App

```bash
cd "3D modeling script"
python app.py
```

Then open your browser and go to:

```
http://localhost:5000
```

## Controls

| Action              | Control                        |
|---------------------|-------------------------------|
| Place block         | Left Click                    |
| Remove block        | Shift + Left Click            |
| Rotate camera       | Ctrl + Right Click (drag)     |
| Zoom               | Mouse Scroll Wheel            |

## License

This project is open source. Feel free to use and modify it.
