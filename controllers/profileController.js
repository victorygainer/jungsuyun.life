const { Profile } = require('../models');

exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.findAll({
            order: [
                ['year', 'DESC'],
                ['title', 'ASC'] 
            ]
          });
        
         // 가져온 데이터를 서버 측에서 필터링합니다.
         const korBioProfiles    = profiles.filter(profile => profile.language === 'Korean'  && profile.category === 'biography');
         const engBioProfiles    = profiles.filter(profile => profile.language === 'English' && profile.category === 'biography');
         const korSolExProfiles  = profiles.filter(profile => profile.language === 'Korean' && profile.category === 'solo_exhibition');
         const engSolExProfiles  = profiles.filter(profile => profile.language === 'English' && profile.category === 'solo_exhibition');
         const korGrpExProfiles  = profiles.filter(profile => profile.language === 'Korean' && profile.category === 'group_exhibition');
         const engGrpExProfiles  = profiles.filter(profile => profile.language === 'English' && profile.category === 'group_exhibition');
         const korAwdProfiles    = profiles.filter(profile => profile.language === 'Korean' && profile.category === 'award');
         const engAwdProfiles    = profiles.filter(profile => profile.language === 'English' && profile.category === 'award');
         const korPblColProfiles = profiles.filter(profile => profile.language === 'Korean' && profile.category === 'public_collection');
         const engPblColProfiles = profiles.filter(profile => profile.language === 'English' && profile.category === 'public_collection');

        res.render('profile', { 
            csrfToken: req.csrfToken() ,
            korBioProfiles   ,
            engBioProfiles   ,
            korSolExProfiles ,
            engSolExProfiles ,
            korGrpExProfiles ,
            engGrpExProfiles ,
            korAwdProfiles   ,
            engAwdProfiles   ,
            korPblColProfiles,
            engPblColProfiles,
        });
    } catch (error) {
        console.error("Error fetching profiles:", error);
        // 에러 처리 로직
    }
};

exports.createProfile = async (req, res) => {
    const profilesData = req.body.params;
  
    try {
      for (let profileData of profilesData) {
        await Profile.create(profileData);
      }
        res.send('모든 프로필이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('프로필 저장 중 오류 발생:', error);
      res.status(500).send('서버 오류로 인해 프로필 저장에 실패했습니다.');
    }
  };

exports.deleteProfile = async (req, res) => {

  const profileId = req.params.profileId;

    try {
        await Profile.destroy({
            where: { id: profileId }
        })
        res.send('삭제 완료되었습니다.');
    } catch (error) {
        console.error('프로필 저장 중 오류 발생:', error);
        res.status(500).send('서버 오류로 인해 프로필 삭제에 실패했습니다.');
    }
};

exports.updateProfile = async (req, res) => {
  const profileId = req.params.profileId;
  
  let title = req.body.title;
  let year = req.body.year;
  let language = req.body.language;
  let category = req.body.category;

  try {
    const updatedProfile = await Profile.update({
      title,
      year,
      language,
      category
    }, {
      where: { id: profileId }
    });

    if (updatedProfile) {
      res.send('프로필이 성공적으로 업데이트되었습니다.');
    } else {
      res.status(404).send('해당 ID를 가진 프로필을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('프로필 업데이트 중 오류 발생:', error);
    res.status(500).send('서버 오류로 인해 프로필 업데이트에 실패했습니다.');
  }
};