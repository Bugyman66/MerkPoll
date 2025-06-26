# 🗳️ MerkPoll Multi-Position Election Demo

## Example Election Structure

```json
{
  "title": "Student Union Elections 2025",
  "organization": "University of California",
  "description": "Annual student body leadership elections",
  "deadline": "2025-07-01T23:59:59.000Z",
  "allowAbstain": true,
  "requireAllPositions": false,
  "resultsVisible": true,
  "positions": [
    {
      "title": "President",
      "description": "Lead the student union and represent student interests",
      "maxSelections": 1,
      "candidates": [
        {
          "name": "Alice Johnson",
          "party": "Reform Party",
          "description": "Experienced leader focused on student services and campus improvements",
          "qualifications": "Former VP, 3.8 GPA, Dean's List, Student Council 3 years",
          "imageUrl": "https://example.com/alice.jpg"
        },
        {
          "name": "Bob Smith", 
          "party": "Student First",
          "description": "Advocate for affordable education and mental health resources",
          "qualifications": "Class President, Honor Society, Volunteer Coordinator",
          "imageUrl": "https://example.com/bob.jpg"
        },
        {
          "name": "Carol Davis",
          "party": "Independent",
          "description": "Focus on sustainability and campus diversity initiatives", 
          "qualifications": "Environmental Club President, 4.0 GPA, Research Assistant",
          "imageUrl": "https://example.com/carol.jpg"
        }
      ]
    },
    {
      "title": "Vice President",
      "description": "Support the president and oversee academic affairs",
      "maxSelections": 1,
      "candidates": [
        {
          "name": "David Wilson",
          "party": "Reform Party", 
          "description": "Experienced in student government and academic policy",
          "qualifications": "Academic Affairs Committee Chair, 3.7 GPA",
          "imageUrl": "https://example.com/david.jpg"
        },
        {
          "name": "Eva Martinez",
          "party": "Student First",
          "description": "Champion for student rights and academic excellence",
          "qualifications": "Student Rights Advocate, Phi Beta Kappa",
          "imageUrl": "https://example.com/eva.jpg"
        }
      ]
    },
    {
      "title": "Board Members",
      "description": "Represent student interests across various committees",
      "maxSelections": 3,
      "candidates": [
        {
          "name": "Frank Brown",
          "party": "Independent",
          "description": "Focus on student life and campus activities",
          "qualifications": "Activities Director, Event Planning Experience",
          "imageUrl": "https://example.com/frank.jpg"
        },
        {
          "name": "Grace Lee",
          "party": "Reform Party",
          "description": "Advocate for international students and inclusivity",
          "qualifications": "International Student Association President",
          "imageUrl": "https://example.com/grace.jpg"
        },
        {
          "name": "Henry Zhang",
          "party": "Student First", 
          "description": "Technology and innovation in education",
          "qualifications": "Computer Science Major, Tech Club Founder",
          "imageUrl": "https://example.com/henry.jpg"
        },
        {
          "name": "Isabel Rodriguez",
          "party": "Independent",
          "description": "Community outreach and social justice",
          "qualifications": "Volunteer Coordinator, Social Justice Club",
          "imageUrl": "https://example.com/isabel.jpg"
        },
        {
          "name": "Jake Thompson",
          "party": "Reform Party",
          "description": "Sports and recreation advocacy",
          "qualifications": "Athletic Committee Representative, Varsity Athlete",
          "imageUrl": "https://example.com/jake.jpg"
        }
      ]
    }
  ],
  "voterEmails": [
    "student1@university.edu",
    "student2@university.edu", 
    "student3@university.edu"
  ]
}
```

## Features Implemented

### ✅ Multi-Position Support
- **Unlimited Positions**: Create elections with any number of positions
- **Flexible Selection**: Configure single or multiple choice per position
- **Rich Descriptions**: Add detailed descriptions for each position

### ✅ Enhanced Candidates
- **Detailed Profiles**: Name, party, description, qualifications, photos
- **Party Affiliation**: Optional political party or group association
- **Visual Elements**: Support for candidate photo URLs

### ✅ Voting Options
- **Abstain Support**: Allow voters to skip positions
- **Required vs Optional**: Force completion of all positions or allow partial voting
- **Result Visibility**: Control when results become visible

### ✅ Admin Interface
- **Dynamic Forms**: Add/remove positions and candidates dynamically
- **Validation**: Ensure all required fields are completed
- **Preview**: See election structure before creation

## Test Scenarios

1. **Simple Election**: 1 position (President), 3 candidates
2. **Complex Election**: 3+ positions with varying selection limits
3. **Large Scale**: Multiple positions with 5+ candidates each
4. **Mixed Selection**: Single choice + multi-choice positions

## Next Steps

1. **Full Voting Interface**: Complete the voting UI with all features
2. **Results Dashboard**: Real-time results with charts and analytics  
3. **Blockchain Integration**: Deploy to Aptos blockchain
4. **Email Notifications**: Automated voter invitations
5. **Advanced Features**: Ranked choice voting, write-in candidates
