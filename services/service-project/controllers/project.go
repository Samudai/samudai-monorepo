package controllers

import (
	"net/http"

	"github.com/Samudai/service-project/internal/project"
	pkg "github.com/Samudai/service-project/pkg/project"
	"github.com/gin-gonic/gin"
)

// CreateProjectParam is the param for CreateProject
type CreateProjectParam struct {
	Project pkg.Project `json:"project" binding:"required"`
}

// CreateProject is the handler for POST /project/create
func CreateProject(c *gin.Context) {
	var params CreateProjectParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectID, err := project.CreateProject(params.Project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"project_id": projectID})
}

// GetAllProject is the handler for GET /project/getall
func GetAllProject(c *gin.Context) {
	projects, err := project.ListAllProject()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, projects)
}

// GetProjectByID is the handler for GET /project/:project_id
func GetProjectByID(c *gin.Context) {
	projectID := c.Param("project_id")
	project, err := project.GetProjectByID(projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, project)
}

func GetContributorByProjectID(c *gin.Context) {
	projectID := c.Param("project_id")
	contributors, err := project.GetContributorByProjectID(projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, contributors)
}

func GetProjectByLinkID(c *gin.Context) {
	linkID := c.Param("link_id")
	var page pkg.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projects, total, err := project.GetProjectByLinkID(linkID, page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"projects": projects, "total": total})
}

func GetProjectsByMemberDAO(c *gin.Context) {
	var params pkg.GetProjectsByMemberDAOParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projects, total, err := project.GetProjectsByMemberDAO(params.MemberID, params.DAOs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"projects": projects, "total": total})
}

func GetProjectsByMember(c *gin.Context) {
	var page pkg.GetProjectsByMemberDAOParam
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projects, err := project.GetProjectsByMember(page.MemberID, page.DAOs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"projects": projects})
}

// UpdateProject is the handler for POST /project/update/:project_id
func UpdateProject(c *gin.Context) {
	var params CreateProjectParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateProject(params.Project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// DeleteProject is the handler for DELETE /project/:project_id
func DeleteProject(c *gin.Context) {
	projectID := c.Param("project_id")
	err := project.DeleteProject(projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreateProjectFileParam struct {
	ProjectFile pkg.ProjectFile `json:"project_file"`
}

func CreateProjectFile(c *gin.Context) {
	var params CreateProjectFileParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectFileID, err := project.CreateProjectFile(params.ProjectFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"project_file_id": projectFileID})
}

func GetProjectFiles(c *gin.Context) {
	folderID := c.Param("folder_id")
	projectFiles, total, err := project.GetProjectFiles(folderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"files": projectFiles, "total": total})
}

func DeleteProjectFile(c *gin.Context) {
	projectFileID := c.Param("project_file_id")
	err := project.DeleteProjectFile(projectFileID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreateGithubLinkParam struct {
	ProjectID   string   `json:"project_id" binding:"required"`
	GithubRepos []string `json:"github_repos" binding:"required"`
	UpdatedBy   string   `json:"updated_by"`
}

func CreateGithubLink(c *gin.Context) {
	var params CreateGithubLinkParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.CreateGithubLink(params.ProjectID, params.GithubRepos, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateProjectColumns(c *gin.Context) {
	var params pkg.UpdateProjectColumnsParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if params.TotalCol < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "total column must be greater than 2"})
		return
	}

	err := project.UpdateProjectColumns(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateProjectCompletedParam struct {
	ProjectID string `json:"project_id" binding:"required"`
	Completed bool   `json:"completed" binding:"required"`
	UpdatedBy string `json:"updated_by"`
}

func UpdateProjectCompleted(c *gin.Context) {
	var params UpdateProjectCompletedParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateProjectCompleted(params.ProjectID, params.Completed, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateProjectVisibilityParam struct {
	ProjectID  string                `json:"project_id" binding:"required"`
	Visibility pkg.ProjectVisibility `json:"visibility" binding:"required"`
	UpdatedBy  string                `json:"updated_by"`
}

func UpdateProjectVisibility(c *gin.Context) {
	var params UpdateProjectVisibilityParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateProjectVisibility(params.ProjectID, params.Visibility, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateProjectPinned(c *gin.Context) {
	var params pkg.UpdateProjectPinnedParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, err := project.UpdateProjectPinned(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"updated": updated})
}
func GetInvestmentForForm(c *gin.Context) {
	daoID := c.Param("dao_id")
	formID := c.Param("form_id")
	projectID, err := project.GetInvestmentForForm(daoID,formID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"project_id": projectID})
}

func GetInvestmentProjectID(c *gin.Context) {
	daoID := c.Param("dao_id")
	projectID, err := project.GetInvestmentProjectID(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"project_id": projectID})
}

type SearchProjectParam struct {
	Query string  `json:"query" binding:"required"`
	DAOID *string `json:"dao_id"`
}

func SearchProject(c *gin.Context) {
	var param SearchProjectParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projects, err := project.SearchProject(param.Query, param.DAOID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"projects": projects})
}

func GetWorkProgress(c *gin.Context) {
	linkID := c.Param("link_id")
	data, err := project.GetWorkProgress(linkID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

type ArchiveProjectParam struct {
	ProjectID  string                `json:"project_id" binding:"required"`
	Archived   bool 				 `json:"is_archived"`
	UpdatedBy  string                `json:"updated_by"`
}

func ArchiveProject(c *gin.Context) {
	var params ArchiveProjectParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.ArchiveProject(params.ProjectID, params.Archived, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetArchivedProjectsByMemberDAO(c *gin.Context) {
	var params pkg.GetProjectsByMemberDAOParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projects, total, err := project.GetArchivedProjectsByMemberDAO(params.MemberID, params.DAOs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"projects": projects, "total": total})
}

func GetProjectCountForDao(c *gin.Context) {
	daoId := c.Param("dao_id");

	count, err := project.GetProjectCountForDao(daoId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": count})
	
}
type CreateFolderParam struct {
	Folder pkg.Folder `json:"folder" binding:"required"`
}

func CreateFolder(c *gin.Context) {
	var params CreateFolderParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	folder, err := project.CreateFolder(params.Folder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"folder_id": folder})
}

func GetFolderByID(c *gin.Context) {
	folderID := c.Param("folder_id")

	folder, err := project.GetFolderByID(folderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, folder)
}

func GetFolderByProjectID(c *gin.Context) {
	projectID := c.Param("project_id")

	folders, err := project.GetFolderByProjectID(projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, folders)
}

func UpdateFolder(c *gin.Context) {
	var params CreateFolderParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateFolder(params.Folder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteFolder(c *gin.Context) {
	folderID := c.Param("folder_id")

	err := project.DeleteFolder(folderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
