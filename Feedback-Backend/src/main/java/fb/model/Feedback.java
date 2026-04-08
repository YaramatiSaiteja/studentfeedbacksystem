package fb.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "course_rating", nullable = false)
    private Integer courseRating;

    @Column(name = "instructor_rating", nullable = false)
    private Integer instructorRating;

    @Column(name = "content_quality")
    private Integer contentQuality;

    @Column(name = "subject_difficulty")
    private Integer subjectDifficulty;

    @Column(name = "practical_application")
    private Integer practicalApplication;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    public Feedback() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Integer getCourseRating() {
        return courseRating;
    }

    public void setCourseRating(Integer courseRating) {
        this.courseRating = courseRating;
    }

    public Integer getInstructorRating() {
        return instructorRating;
    }

    public void setInstructorRating(Integer instructorRating) {
        this.instructorRating = instructorRating;
    }

    public Integer getContentQuality() {
        return contentQuality;
    }

    public void setContentQuality(Integer contentQuality) {
        this.contentQuality = contentQuality;
    }

    public Integer getSubjectDifficulty() {
        return subjectDifficulty;
    }

    public void setSubjectDifficulty(Integer subjectDifficulty) {
        this.subjectDifficulty = subjectDifficulty;
    }

    public Integer getPracticalApplication() {
        return practicalApplication;
    }

    public void setPracticalApplication(Integer practicalApplication) {
        this.practicalApplication = practicalApplication;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.submittedAt = LocalDateTime.now();
    }
}
