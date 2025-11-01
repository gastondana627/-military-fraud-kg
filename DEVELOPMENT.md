# Development Guide

## Before Starting Any Feature Work

1. Create a branch:
   git checkout -b feature/node-redesign

2. Check ROADMAP.md to see what's next

3. Update this file with what you're working on

4. Test locally before pushing

## Code Standards

### Frontend (React)
- Use functional components with hooks
- Props validation with PropTypes
- Proper error handling in fetch calls
- Always test CORS before deploying

Example:
const KnowledgeGraphVisualizer = ({ apiUrl }) => {
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    fetch(`${apiUrl}/api/graph`)
      .catch(err => console.error(err));
  }, [apiUrl]);
  return <div>{/* component */}</div>;
};

### Backend (Flask)
- All routes return JSON with status codes (200/400/500)
- Error handling with try-catch
- CORS headers properly set
- Document API responses

Example:
@app.route('/api/graph', methods=['GET'])
def get_graph():
    try:
        nodes = kg.nodes.values()
        return jsonify({'nodes': nodes}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

## Testing Workflow

1. Start both servers locally:
   Terminal 1: python app.py
   Terminal 2: npm start (in frontend/)

2. Test in browser: http://localhost:3000

3. Check console for errors (F12)

4. Test API directly:
   curl http://localhost:4000/api/health

5. Only push after local testing passes

## Commit Message Format

feat: Add search functionality
fix: CORS headers not working
docs: Update README with API docs
style: Improve node styling
refactor: Reorganize graph loading logic
test: Add unit tests for graph queries

## Deployment Checklist

Before pushing to main:
- [ ] Local tests pass
- [ ] No console errors
- [ ] CORS working
- [ ] Environment vars correct
- [ ] Updated README if needed
- [ ] Commit message is descriptive

## Common Issues & Solutions

Issue: CORS error in production
Solution: Check CORS origins in app.py match Vercel domain

Issue: Graph won't load
Solution: Check /api/health, verify backend is running

Issue: Changes not showing
Solution: Hard refresh (Ctrl+Shift+R), check cache

## Next Dev Session Checklist

When returning to project:
1. git pull origin main
2. npm install (in frontend/)
3. pip install -r requirements.txt
4. python app.py & npm start
5. Check ROADMAP.md for next feature
6. Create feature branch
7. Code!
