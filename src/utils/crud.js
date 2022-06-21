import { User } from './../../src/res/user/user.model.js';
const admin = {
  phNo: '',
  password: '',
  role: 'admin',
  createdBy: '',
};
const student = {
  phNo: '',
  password: '',
  role: 'student',
  createdBy: '',
};

const teacher = {
  name: '',
  phNo: '',
  password: '',
  role: 'teacher',
  createdBy: '',
};

const questionForm = {
  question: [],
};

export const getOne = (model) => async (req, res) => {
  console.log('getOne');
  const createdBy = req.user._id;
  try {
    const doc = await model
      .findOne({ _id: req.params.id, createdBy })
      .lean()
      .exec();

    if (!doc) {
      return res.status(400).end();
    }

    res.status(200).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getAll = (model) => async (req, res) => {
  // console.log('...getAll...');
  try {
    const docs = await model.find().lean().exec();
    // console.log('docs:', docs);

    res.status(200).json(docs);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

const getPagination = (page, size) => {
  const limit = size ? +size : 4;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

export const getPage = (model) => async (req, res, next) => {
  console.log('😎😎😎req:', req.query);
  if (req.query.phNo) {
    next();
  } else {
    const { page, perpage } = req.query;
    const { limit, offset } = getPagination(page, perpage);

    try {
      const docs = await model.paginate({}, { offset, limit });
      console.log('😂😂😂docs:', docs);

      res.status(200).json(docs);
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  }
};

export const createOne = (model) => async (req, res) => {
  console.log('createOne:');
  const createdBy = req.user._id;
  try {
    const doc = await model.create({ ...req.body, createdBy });
    res.status(201).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const createQuiz = (model) => async (req, res) => {
  console.log('createQuiz ');
  // console.log('reqQuizBody.quiComplted is : ', req.body.quizCompleted);

  const course = req.body.course;
  const subject = req.body.subject;
  const schoolId = req.body.schoolId;
  const teacherId = req.body.teacherId;
  const questions = req.body.questions;
  // const quizCompleted = req.body.quizCompleted;
  const quizCompletedStudents = req.body.quizCompletedStudents;

  try {
    const doc = await model.create({
      course,
      subject,
      schoolId,
      teacherId,
      questions,
      // quizCompleted,
      quizCompletedStudents,
    });

    res.status(201).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getQuizTeacherSide = (model) => async (req, res, next) => {
  console.log('getQuizTeacherSide');

  try {
    const data = await model
      .find({
        teacherId: req.query.teacherId,
        schoolId: req.query.schoolId,
      })
      .lean()
      .exec();

    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getQuizStudentSide = (model) => async (req, res, next) => {
  console.log('getQuizStudentSide');

  try {
    const docs = await model
      .find({
        schoolId: req.query.schoolId,
        course: req.query.course,
        subject: req.query.subject,
      })
      .lean()
      .exec();

    res.status(200).json(docs);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};
export const createQuizSumbission = (model) => async (req, res) => {
  console.log('createQuizSumbission ');
  // console.log('req.body///: ', req.body);

  try {
    console.log('createQuizSumbission');
    const doc = await model.create({
      studentName: req.body.studentName,
      course: req.body.currentStudentCourse,
      subject: req.body.subject,
      scored: req.body.score,
      schoolId: req.body.schoolId,
      teacherId: req.body.teacherId,
      questions: req.body.questions,
      selectedOptions: req.body.selectedOptions,
    });

    res.status(201).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};
export const addStudentIdToQuiz = (model) => async (req, res) => {
  console.log('updateQuiz');
  // console.log('updateQuiz-req.body', req.body);
  console.log('updateQuiz-req.....', req.body.quizCompletedStudents);

  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $push: {
            quizCompletedStudents: req.body.quizCompletedStudents,
          },
        },
        { new: true }
      )
      .lean()
      .exec();

    if (!updatedDoc) {
      return res.status(400).end();
    }

    res.status(200).json(updatedDoc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const removeOne = (model) => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      _id: req.params.id,
    });

    if (!removed) {
      return res.status(400).end();
    }

    return res.status(200).json(removed);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const updateOne = (model) => async (req, res) => {
  console.log('updateOne');
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        { new: true }
      )
      .lean()
      .exec();

    if (!updatedDoc) {
      return res.status(400).end();
    }

    res.status(200).json(updatedDoc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const createSchool = (model) => async (req, res) => {
  const createdBy = req.user._id;

  try {
    const doc = await model.create({ ...req.body, createdBy });
    (admin.phNo = doc.phNo),
      (admin.password = doc.password),
      (admin.createdBy = doc.createdBy),
      res.status(201).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
  try {
    const user = await User.create(admin);
    const accessToken = newAccessToken(user);
    res.cookie('payload', accessToken.split('.').splice(0, 2).join('.'), {
      maxAge: process.env.PERMANENT_COOKIE_EXP * 60 * 1000,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('signature', accessToken.split('.').splice(2, 1), {
      maxAge: process.env.SESSION_COOKIE_EXP * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).end();
  } catch (e) {
    console.error(e);
    return res.status(400).end();
  }
};

export const createTeacher = (model) => async (req, res) => {
  const createdBy = req.user._id;

  try {
    const doc = await model.create({ ...req.body, createdBy });
    (teacher.name = doc.name),
      (teacher.phNo = doc.phNo),
      (teacher.password = doc.password),
      (teacher.createdBy = doc.createdBy),
      res.status(201).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }

  try {
    const user = await User.create(teacher);
    const accessToken = newAccessToken(user);
    res.cookie('payload', accessToken.split('.').splice(0, 2).join('.'), {
      maxAge: process.env.PERMANENT_COOKIE_EXP * 60 * 1000,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('signature', accessToken.split('.').splice(2, 1), {
      maxAge: process.env.SESSION_COOKIE_EXP * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).end();
  } catch (e) {
    console.error(e);
    return res.status(400).end();
  }
};

export const createStudent = (model) => async (req, res) => {
  const createdBy = req.user._id;

  try {
    const doc = await model.create({ ...req.body, createdBy });
    (student.phNo = doc.phNo),
      (student.password = doc.password),
      (student.createdBy = doc.createdBy),
      res.status(201).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
  try {
    const user = await User.create(student);
    const accessToken = newAccessToken(user);
    res.cookie('payload', accessToken.split('.').splice(0, 2).join('.'), {
      maxAge: process.env.PERMANENT_COOKIE_EXP * 60 * 1000,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('signature', accessToken.split('.').splice(2, 1), {
      maxAge: process.env.SESSION_COOKIE_EXP * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).end();
  } catch (e) {
    console.error(e);
    return res.status(400).end();
  }
};

export const getOneStudent = (model) => async (req, res) => {
  try {
    const doc = await model.findOne({ phNo: req.query.phNo }).lean().exec();

    if (!doc) {
      return res.status(400).end();
    }

    res.status(200).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getOneTeacher = (model) => async (req, res) => {
  console.log('this is req: ', req.query.phNo);
  try {
    const doc = await model.findOne({ phNo: req.query.phNo }).lean().exec();
    console.log('get one teacher route');
    if (!doc) {
      return res.status(400).end();
    }

    res.status(200).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getTeachers = (model) => async (req, res) => {
  console.log('req.query: ', req.query);
  try {
    const doc = await model
      .findOne({ createdBy: req.query.schoolId })
      .lean()
      .exec();
    // console.log('  req.query.schoolId ', req.query.schoolId);
    // console.log('  getTeachers ');
    // if (!doc) {
    //   return res.status(400).end();
    // }

    res.status(200).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getAssignmentPage = (model) => async (req, res, next) => {
  console.log('getAssignmentPage');
  const { page, perpage } = req.query;
  const { limit, offset } = getPagination(page, perpage);
  if (req.query.createdBy || req.query.dataOnly) {
    next();
  } else {
    try {
      const docs = await model.paginate(
        { course: req.query.course, schoolId: req.query.schoolId },
        { offset, limit }
      );

      res.status(200).json(docs);
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  }
};

export const getTeacherAssignmentPage = (model) => async (req, res, next) => {
  if (req.query.dataOnly) {
    next();
  } else {
    const { page, perpage } = req.query;
    const { limit, offset } = getPagination(page, perpage);
    console.log('TeacherId is : ', req.query.createdBy);
    try {
      const docs = await model.paginate(
        { createdBy: req.query.createdBy },
        { offset, limit }
      );

      res.status(200).json(docs);
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  }
};

export const getAssignmentData = (model) => async (req, res) => {
  try {
    const doc = await model
      .find({
        course: req.query.course,
        schoolId: req.query.schoolId,
      })
      .lean()
      .exec();

    if (!doc) {
      return res.status(400).end();
    }

    res.status(200).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getMySubmissions = (model) => async (req, res, next) => {
  if (req.query.teacherIdSubmission) {
    next();
  } else {
    console.log('inside wrong route');
    const { page, perpage } = req.query;
    const { limit, offset } = getPagination(page, perpage);

    try {
      const docs = await model.paginate(
        {
          schoolId: req.query.schoolId,
          createdBy: req.query.studentIdSubmission,
        },
        { offset, limit }
      );

      res.status(200).json(docs);
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  }
};

export const getStudentSubmissions = (model) => async (req, res) => {
  const { page, perpage } = req.query;
  const { limit, offset } = getPagination(page, perpage);

  try {
    const docs = await model.paginate(
      {
        schoolId: req.query.schoolId,
        teacherId: req.query.teacherIdSubmission,
      },
      { offset, limit }
    );

    res.status(200).json(docs);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getAllSubjects = (model) => async (req, res) => {
  console.log('reqQuery is :', req.query);
  try {
    const docs = await model.find({ course: req.query.course }).lean().exec();

    res.status(200).json(docs);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getOneQuiz = (model) => async (req, res) => {
  try {
    const doc = await model
      .findOne({
        course: req.query.course,
        subject: req.query.subject,
        schoolId: req.query.createdBy,
      })
      .lean()
      .exec();

    if (!doc) {
      return res.status(400).end();
    }

    res.status(200).json(doc);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const crudControllers = (model) => ({
  removeOne: removeOne(model),
  getAll: getAll(model),
  getOne: getOne(model),
  getPage: getPage(model),
  createOne: createOne(model),
  createQuiz: createQuiz(model),
  updateOne: updateOne(model),
  createSchool: createSchool(model),
  createTeacher: createTeacher(model),
  createStudent: createStudent(model),
  getOneStudent: getOneStudent(model),
  getOneTeacher: getOneTeacher(model),
  getAssignmentPage: getAssignmentPage(model),
  getTeacherAssignmentPage: getTeacherAssignmentPage(model),
  getAssignmentData: getAssignmentData(model),
  getStudentSubmissions: getStudentSubmissions(model),
  getMySubmissions: getMySubmissions(model),
  getAllSubjects: getAllSubjects(model),
  getOneQuiz: getOneQuiz(model),
  getQuizTeacherSide: getQuizTeacherSide(model),
  getQuizStudentSide: getQuizStudentSide(model),
  getTeachers: getTeachers(model),
  createQuizSumbission: createQuizSumbission(model),
  // getQuizResults: getQuizResults(model),
  addStudentIdToQuiz: addStudentIdToQuiz(model),
});
