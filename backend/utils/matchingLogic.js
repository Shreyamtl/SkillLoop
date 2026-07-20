export const findMatches = (user1, user2) => {
  const sharedSkills = user2.skillsToTeach.filter(
    skill => user1.skillsToLearn.includes(skill)
  );

  const mutualSkills = user1.skillsToTeach.filter(
    skill => user2.skillsToLearn.includes(skill)
  );

  return {
    sharedSkills,
    mutual: mutualSkills.length > 0,
  };
};

export const getSuggestedMatches = (currentUser, allUsers) => {
  const matches = [];

  for (const user of allUsers) {
    if (user._id.toString() === currentUser._id.toString()) continue;

    const { sharedSkills, mutual } = findMatches(currentUser, user);
    
    if (sharedSkills.length > 0) {
      matches.push({
        _id: user._id,
        name: user.name,
        skillsToTeach: user.skillsToTeach,
        sharedSkills,
        mutual,
      });
    }
  }

  matches.sort((a, b) => {
    if (a.mutual && !b.mutual) return -1;
    if (!a.mutual && b.mutual) return 1;
    return b.sharedSkills.length - a.sharedSkills.length;
  });

  return matches;
};
