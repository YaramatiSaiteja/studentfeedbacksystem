package fb.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fb.dto.FeedbackAnalytics;
import fb.model.Course;
import fb.model.Feedback;
import fb.repository.FeedbackRepository;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private CourseService courseService;

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    public List<Feedback> getFeedbackForCourse(Long courseId) {
        return feedbackRepository.findByCourseId(courseId);
    }

    public List<Feedback> getFeedbackForStudent(String studentId) {
        return feedbackRepository.findByStudentId(studentId);
    }

    public Feedback submitFeedback(Feedback feedback) {
        Feedback existing = feedbackRepository.findByCourseIdAndStudentId(feedback.getCourseId(), feedback.getStudentId());
        if (existing != null) {
            existing.setCourseRating(feedback.getCourseRating());
            existing.setInstructorRating(feedback.getInstructorRating());
            existing.setContentQuality(feedback.getContentQuality());
            existing.setSubjectDifficulty(feedback.getSubjectDifficulty());
            existing.setPracticalApplication(feedback.getPracticalApplication());
            existing.setComment(feedback.getComment());
            return feedbackRepository.save(existing);
        }
        return feedbackRepository.save(feedback);
    }

    public List<Course> getPendingCoursesForStudent(String studentId) {
        List<Course> allCourses = courseService.getAllCourses();
        List<Feedback> studentFeedback = getFeedbackForStudent(studentId);
        Set<Long> evaluatedCourseIds = studentFeedback.stream()
                .map(Feedback::getCourseId)
                .collect(Collectors.toSet());

        return allCourses.stream()
                .filter(course -> !evaluatedCourseIds.contains(course.getId()))
                .collect(Collectors.toList());
    }

    public FeedbackAnalytics getAnalytics() {
        List<Feedback> feedbackList = getAllFeedback();
        FeedbackAnalytics analytics = new FeedbackAnalytics();

        if (feedbackList.isEmpty()) {
            analytics.setTotalFeedback(0);
            analytics.setAverageCourseRating(0);
            analytics.setAverageInstructorRating(0);
            analytics.setAverageContentQuality(0);
            analytics.setAveragePracticalApplication(0);
            analytics.setAverageSubjectDifficulty(0);
            return analytics;
        }

        long total = feedbackList.size();
        double sumCourseRating = feedbackList.stream().mapToDouble(f -> f.getCourseRating() != null ? f.getCourseRating() : 0).sum();
        double sumInstructorRating = feedbackList.stream().mapToDouble(f -> f.getInstructorRating() != null ? f.getInstructorRating() : 0).sum();
        double sumContentQuality = feedbackList.stream().mapToDouble(f -> f.getContentQuality() != null ? f.getContentQuality() : 0).sum();
        double sumPracticalApplication = feedbackList.stream().mapToDouble(f -> f.getPracticalApplication() != null ? f.getPracticalApplication() : 0).sum();
        double sumSubjectDifficulty = feedbackList.stream().mapToDouble(f -> f.getSubjectDifficulty() != null ? f.getSubjectDifficulty() : 0).sum();

        analytics.setTotalFeedback(total);
        analytics.setAverageCourseRating(round(sumCourseRating / total));
        analytics.setAverageInstructorRating(round(sumInstructorRating / total));
        analytics.setAverageContentQuality(round(sumContentQuality / total));
        analytics.setAveragePracticalApplication(round(sumPracticalApplication / total));
        analytics.setAverageSubjectDifficulty(round(sumSubjectDifficulty / total));
        return analytics;
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
