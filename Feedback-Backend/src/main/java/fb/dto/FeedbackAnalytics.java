package fb.dto;

public class FeedbackAnalytics {

    private long totalFeedback;
    private double averageCourseRating;
    private double averageInstructorRating;
    private double averageContentQuality;
    private double averagePracticalApplication;
    private double averageSubjectDifficulty;

    public long getTotalFeedback() {
        return totalFeedback;
    }

    public void setTotalFeedback(long totalFeedback) {
        this.totalFeedback = totalFeedback;
    }

    public double getAverageCourseRating() {
        return averageCourseRating;
    }

    public void setAverageCourseRating(double averageCourseRating) {
        this.averageCourseRating = averageCourseRating;
    }

    public double getAverageInstructorRating() {
        return averageInstructorRating;
    }

    public void setAverageInstructorRating(double averageInstructorRating) {
        this.averageInstructorRating = averageInstructorRating;
    }

    public double getAverageContentQuality() {
        return averageContentQuality;
    }

    public void setAverageContentQuality(double averageContentQuality) {
        this.averageContentQuality = averageContentQuality;
    }

    public double getAveragePracticalApplication() {
        return averagePracticalApplication;
    }

    public void setAveragePracticalApplication(double averagePracticalApplication) {
        this.averagePracticalApplication = averagePracticalApplication;
    }

    public double getAverageSubjectDifficulty() {
        return averageSubjectDifficulty;
    }

    public void setAverageSubjectDifficulty(double averageSubjectDifficulty) {
        this.averageSubjectDifficulty = averageSubjectDifficulty;
    }
}
