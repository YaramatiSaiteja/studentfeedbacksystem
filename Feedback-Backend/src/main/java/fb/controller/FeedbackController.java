package fb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fb.dto.FeedbackAnalytics;
import fb.model.Course;
import fb.model.Feedback;
import fb.service.FeedbackService;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    public List<Feedback> getFeedbackForCourse(@PathVariable Long courseId) {
        return feedbackService.getFeedbackForCourse(courseId);
    }

    @GetMapping("/student/{studentId}")
    public List<Feedback> getFeedbackForStudent(@PathVariable String studentId) {
        return feedbackService.getFeedbackForStudent(studentId);
    }

    @GetMapping("/pending/{studentId}")
    public List<Course> getPendingCourses(@PathVariable String studentId) {
        return feedbackService.getPendingCoursesForStudent(studentId);
    }

    @GetMapping("/analytics")
    public FeedbackAnalytics getAnalytics() {
        return feedbackService.getAnalytics();
    }

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {
        if (feedback.getCourseId() == null || feedback.getStudentId() == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(feedbackService.submitFeedback(feedback));
    }
}
